import store from "@/store";
import { vm } from "@/main";
import router from "@/router";
import { firestore } from "@/firebase.js";
import { config, constraints } from "@/constants/peer-connection.js";

import Caller from "@/store/modules/conference/caller";
import Callee from "@/store/modules/conference/callee";
import {
  InitParams,
  MediaTrackToStream,
  Streams,
  DocRef,
  CollectionRef,
  QuerySnapshot,
  DocChange,
  TrackToPC,
  FailedToJoin,
  ReplaceTrack,
  GetTrack,
  DescriptionToPC,
} from "@/components/conference/types";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";

@Module({ name: "conferenceMain", namespaced: true, dynamic: true, store })
class ConferenceMain extends VuexModule {
  streams: Streams = {
    local: new MediaStream(),
    remote: new MediaStream(),
  };
  peerConnection: RTCPeerConnection = new RTCPeerConnection(config);
  roomRef: DocRef | null = null;

  // ! -----------------------------------------------------------------------------------

  // ! --- Init Room ---------------------------------------------------------------------

  // ! -----------------------------------------------------------------------------------

  @Action
  async init({ isCaller, id }: InitParams): Promise<void> {
    if (!isCaller && !id) return this.failedToJoin({ err: "Room id is null" });

    await this.addLocalTracks();

    const isSuccess: boolean = isCaller
      ? await Caller.createRoom()
      : await Callee.joinRoom(id!);
    if (!isSuccess) return;
  }
  // @Action
  // listenForPeerConnectionChanges(): void {
  //   addListener({
  //     name: "icegatheringstatechange",
  //     log: {
  //       pre: "ICE gathering state changed",
  //       name: "iceGatheringState",
  //     },
  //   });
  //   addListener({
  //     name: "connectionstatechange",
  //     log: {
  //       pre: "Connection state change",
  //       name: "connectionState",
  //     },
  //   });
  //   addListener({
  //     name: "signalingstatechange",
  //     log: {
  //       pre: "Signaling state change",
  //       name: "signalingState",
  //     },
  //   });
  //   addListener({
  //     name: "iceconnectionstatechange",
  //     log: {
  //       pre: "ICE connection state change",
  //       name: "iceConnectionState",
  //     },
  //   });

  //   function addListener({ name, log }: PeerConnectionEvent) {
  //     const pc = self.peerConnection;
  //     pc.addEventListener(name, () =>
  //       //@ts-ignore
  //       console.log(`${log.pre}: ${pc[log.name]}`)
  //     );
  //   }
  // }
  @Action
  async addLocalTracks() {
    const source = await navigator.mediaDevices.getUserMedia(constraints);
    this.addMediaTrackToStream({ source, isVideo: true, isLocal: true });
    this.addMediaTrackToStream({ source, isVideo: false, isLocal: true });

    const local: MediaStream = this.streams.local;
    this.addTrackToPeerConnection({ source: local, isVideo: true });
    this.addTrackToPeerConnection({ source: local, isVideo: false });
  }
  @Action
  setListeners({ isCaller }: { isCaller: boolean }) {
    // this.listenForPeerConnectionChanges(); // * For debugging
    this.listenForNewLocalIceCandidates({ isCaller });
    this.listenForNewRemoteIceCandidates({ isCaller });
    this.listenForNewRemoteTracks();
    this.listenForPeerConnectionClose(this.closeRoom);
  }
  @Action
  listenForNewLocalIceCandidates({ isCaller }: { isCaller: boolean }): void {
    const self = this;

    const ref: CollectionRef | undefined = getCollectionRef();
    if (!ref) return;
    this.peerConnection.addEventListener("icecandidate", pushToStore);

    function getCollectionRef(): CollectionRef | undefined {
      const name: string = isCaller ? "callerCandidates" : "calleeCandidates";
      return firestore.collection(self.roomRef!, name);
    }
    function pushToStore(e: RTCPeerConnectionIceEvent) {
      if (!e.candidate) return console.log("Got final candidate!");

      console.log("Got candidate: ", e.candidate);
      const candidateJSON: RTCIceCandidateInit = e.candidate.toJSON();
      firestore.addDoc(ref!, candidateJSON);
    }
  }
  @Action
  listenForNewRemoteTracks() {
    const self = this;
    this.peerConnection.addEventListener("track", pullTracks);

    function pullTracks(e: RTCTrackEvent): void {
      const source = e.streams[0];
      self.addMediaTrackToStream({ source, isVideo: true, isLocal: false });
      self.addMediaTrackToStream({ source, isVideo: false, isLocal: false });
    }
  }
  @Action
  listenForNewRemoteIceCandidates({ isCaller }: { isCaller: boolean }) {
    const self = this;

    addListener(getCollectionRef());

    function getCollectionRef(): CollectionRef {
      const name: string = isCaller ? "calleeCandidates" : "callerCandidates";
      return firestore.collection(self.roomRef!, name);
    }
    function addListener(ref: CollectionRef): void {
      firestore.onSnapshot(ref, pullCandidates);

      function pullCandidates(snapshot: QuerySnapshot): void {
        snapshot.docChanges().forEach(tryPullCandidate);

        async function tryPullCandidate(change: DocChange): Promise<void> {
          if (change.type != "added") return;
          const candidate = change.doc.data();
          console.log("Got new remote ICE candidate: ", candidate);
          self.pullIceCandidateToPC(candidate);
        }
      }
    }
  }

  // ! -----------------------------------------------------------------------------------

  // ! --- utility Actions ---------------------------------------------------------------

  // ! -----------------------------------------------------------------------------------

  @Action
  failedToJoin({ path, err }: FailedToJoin) {
    console.error(err);
    alert("Failed to join the meeting.");
    this.closeRoom(path);
  }
  @Action
  closeRoom(path?: string) {
    this.closePeerConnection();
    vm.$vuetify.theme.dark = false;
    router.push({ path: path || "/" });
  }
  @Action
  replaceLocalTrack({ isVideo, newTrack }: ReplaceTrack): void {
    this.replaceTrackInPC({ isVideo, newTrack });

    this.removeTrackFromStream({ isVideo, isLocal: true });
    this.addDisplayTrackToStream(newTrack);
  }

  // ! -----------------------------------------------------------------------------------

  // ! --- setup Mutations -----------------------------------------------

  // ! -----------------------------------------------------------------------------------

  @Mutation
  addMediaTrackToStream({ source, isVideo, isLocal }: MediaTrackToStream) {
    const side: string = isLocal ? "local" : "remote";
    const track: MediaStreamTrack = isVideo
      ? source.getVideoTracks()[0]
      : source.getAudioTracks()[0];
    this.streams[side].addTrack(track);

    console.log(`Got a ${side} track:`, track);
  }
  @Mutation
  closePeerConnection() {
    this.peerConnection.close();
    this.peerConnection = new RTCPeerConnection(config);
  }
  @Mutation
  listenForPeerConnectionClose(closeRoom: Function) {
    const pc = this.peerConnection;
    pc.oniceconnectionstatechange = () =>
      pc.iceConnectionState == "disconnected" ? closeRoom() : null;
  }
  @Mutation
  addTrackToPeerConnection({ source, isVideo }: TrackToPC) {
    const track = isVideo
      ? source.getVideoTracks()[0]
      : source.getAudioTracks()[0];
    this.peerConnection.addTrack(track, source);
  }
  @Mutation
  setDescriptionToPC({ description, isLocal }: DescriptionToPC) {
    isLocal
      ? this.peerConnection.setLocalDescription(description)
      : this.peerConnection.setRemoteDescription(description);
  }
  @Mutation
  setRoomRef(roomRef: DocRef) {
    this.roomRef = roomRef;
  }
  @Mutation
  pullIceCandidateToPC(candidate: RTCIceCandidateInit) {
    this.peerConnection.addIceCandidate(candidate);
  }

  // ! -----------------------------------------------------------------------------------

  // ! --- utility Mutations -------------------------------------------------------------

  // ! -----------------------------------------------------------------------------------

  @Mutation
  toggleCam(isOn: boolean) {
    this.streams.local.getVideoTracks()[0].enabled = isOn;
  }
  @Mutation
  toggleMic(isOn: boolean) {
    this.streams.local.getAudioTracks()[0].enabled = isOn;
  }
  @Mutation
  replaceTrackInPC({ isVideo, newTrack }: ReplaceTrack) {
    const self = this;
    const videoSender: RTCRtpSender = getSender();
    videoSender.replaceTrack(newTrack);
    console.log(`Replaced a peer connection track:`, newTrack);

    function getSender(): RTCRtpSender {
      const senders: RTCRtpSender[] = self.peerConnection.getSenders();
      const type = isVideo ? "video" : "audio";
      return senders.find((sender) => sender.track!.kind == type)!;
    }
  }
  @Mutation
  removeTrackFromStream({ isLocal, isVideo }: GetTrack) {
    const side: string = isLocal ? "local" : "remote";
    const stream: MediaStream = this.streams[side];
    const track = isVideo
      ? stream.getVideoTracks()[0]
      : stream.getAudioTracks()[0];

    stream.removeTrack(track);

    console.log(`Removed a ${side} track:`, track);
  }
  @Mutation
  addDisplayTrackToStream(track: MediaStreamTrack) {
    this.streams.local.addTrack(track);
  }
  @Mutation
  stopTrack({ isLocal, isVideo }: GetTrack) {
    const side: string = isLocal ? "local" : "remote";
    const stream: MediaStream = this.streams[side];
    const track: MediaStreamTrack = isVideo
      ? stream.getVideoTracks()[0]
      : stream.getAudioTracks()[0];
    if (track.onended == null) return console.error("onended is null");
    track.stop();
    track.onended(new Event("ended"));
  }
}

export default getModule(ConferenceMain);
