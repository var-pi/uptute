import store from "@/store";
import { db, firestore } from "@/firebase";

import Main from "@/store/modules/conference/main";
import Chat from "@/store/modules/conference/chat";
import { Module, VuexModule, Action, getModule } from "vuex-module-decorators";
import {
  CollectionRef,
  DocRef,
  DocSnapshot,
} from "@/components/conference/types";

@Module({ name: "conferenceCaller", namespaced: true, dynamic: true, store })
class ConferenceCaller extends VuexModule {
  @Action
  async createRoom(): Promise<boolean> {
    Chat.createDataChannel();

    const offer = await Main.peerConnection.createOffer();

    const isOfferSent = await this.sendOffer(offer);
    if (!isOfferSent) return false;

    Main.setListeners({ isCaller: true });
    this.listenForRemoteDescription();

    Main.setDescriptionToPC({ description: offer, isLocal: true }); // !

    return true;
  }
  @Action
  async sendOffer(offer: RTCSessionDescriptionInit) {
    const rooms: CollectionRef = firestore.collection(db, "rooms");
    const offerJSON: string = JSON.stringify(offer);
    const roomRef: DocRef = await firestore.addDoc(rooms, { offer: offerJSON });

    if (!roomRef) return Main.failedToJoin({ err: "Room ref undefined" });
    Main.setRoomRef(roomRef);

    console.log("New room created with SDP offer.");
    console.log(`Room ID: ${roomRef.id}`);

    return true;
  }
  @Action
  listenForRemoteDescription(): void {
    firestore.onSnapshot(Main.roomRef!, setRemoteDescription);

    async function setRemoteDescription(snapshot: DocSnapshot) {
      const pc: RTCPeerConnection = Main.peerConnection;

      const answerJSON = snapshot.data()?.answer;
      if (!answerJSON) return;

      const ifExists: boolean = !!pc.currentRemoteDescription;
      if (ifExists) return console.error("Remote description already exists");

      const answer = JSON.parse(answerJSON);
      console.log("Got remote description: ", answer);
      Main.setDescriptionToPC({ description: answer, isLocal: false });
    }
  }
}

export default getModule(ConferenceCaller);
