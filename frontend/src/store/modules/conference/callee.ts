import store from "@/store";
import { db, firestore } from "@/firebase.js";

import Main from "@/store/modules/conference/main";
import Chat from "@/store/modules/conference/chat";
import { DocData, DocSnapshot } from "@/components/conference/types";
import { Module, VuexModule, Action, getModule } from "vuex-module-decorators";

@Module({ name: "conferenceCallee", namespaced: true, dynamic: true, store })
class ConferenceCallee extends VuexModule {
  @Action
  async joinRoom(roomId: string): Promise<boolean> {
    Main.setRoomRef(firestore.doc(db, "rooms", roomId));

    Main.setListeners({ isCaller: false });
    this.listenForRemoteDescription(this.sendAnswer);

    Main.peerConnection!.ondatachannel = Chat.pullDataChannel;

    return true;
  }
  @Action
  listenForRemoteDescription(sendAnswer: Function): void {
    firestore.onSnapshot(Main.roomRef!, (doc: DocSnapshot) => {
      const data: DocData = doc.data()!;
      const offer: RTCSessionDescriptionInit = JSON.parse(data.offer);
      Main.setDescriptionToPC({ description: offer, isLocal: false });

      if (!data.answer) sendAnswer();
    });
  }
  @Action
  async sendAnswer(): Promise<void> {
    const answer = await Main.peerConnection.createAnswer();
    Main.setDescriptionToPC({ description: answer, isLocal: true });
    const answerJSON: string = JSON.stringify(answer);
    firestore.updateDoc(Main.roomRef!, { answer: answerJSON });
  }
}

export default getModule(ConferenceCallee);
