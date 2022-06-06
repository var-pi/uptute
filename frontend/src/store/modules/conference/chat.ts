import store from "@/store";
import { dataChannelOptions as options } from "@/constants/peer-connection";

import Main from "@/store/modules/conference/main";
import { Message, SaveMessage } from "@/components/conference/types";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";

@Module({ name: "conferenceChat", namespaced: true, dynamic: true, store })
class ConferenceChat extends VuexModule {
  dc: RTCDataChannel = new RTCPeerConnection().createDataChannel("");
  messages: Message[] = [];
  isOpen: boolean = false;
  messagesOnChannelOpen: Array<string> = [];

  @Action
  createDataChannel(): void {
    const params: [string, typeof options] = ["chat", options];
    const dc: RTCDataChannel = Main.peerConnection.createDataChannel(...params);

    this.setDataChannel(dc);
    this.setListeners();

    console.log("Created a data channel:", dc);
  }
  @Action
  pullDataChannel(e: RTCDataChannelEvent): void {
    const dc = e.channel;
    this.setDataChannel(dc);
    this.setListeners();

    console.log("Pulled a data channel:", dc);
  }

  // ! -----------------------------------------------------------------------------------

  // ! --- utility Actions ---------------------------------------------------------------

  // ! -----------------------------------------------------------------------------------

  @Action
  sendMessage(text: string) {
    if (this.isOpen) this.sendToDataChannel(text);
    else this.addToOnChannelOpen(text);
    this.saveMessage({ text, isSelf: true });

    console.log("Sent a Message: ", text);
  }
  @Action
  setListeners() {
    this.listenForMessage(this.saveMessage);
    this.listenForError();
    this.listenForOpen(this.sendMessagesOnChannelOpen);
    this.listenForClose();
  }
  @Action
  sendMessagesOnChannelOpen() {
    this.messagesOnChannelOpen.forEach((msg) => this.sendMessage(msg));
  }

  // ! -----------------------------------------------------------------------------------

  // ! --- Mutations ---------------------------------------------------------------------

  // ! -----------------------------------------------------------------------------------

  @Mutation
  setDataChannel(dc: RTCDataChannel) {
    this.dc = dc;
  }
  @Mutation
  listenForMessage(saveMessage: Function) {
    this.dc.onmessage = (e: MessageEvent) =>
      saveMessage({ text: e.data, isSelf: false });
  }
  @Mutation
  listenForError() {
    this.dc.onerror = (err: Event) => console.error("Data Channel Error:", err);
  }
  @Mutation
  listenForOpen(sendMessagesOnChannelOpen: Function) {
    this.dc.onopen = () => {
      this.isOpen = true;
      sendMessagesOnChannelOpen();
    };
  }
  @Mutation
  listenForClose() {
    this.dc.onclose = () => (this.isOpen = false);
  }
  @Mutation
  saveMessage({ text, isSelf }: SaveMessage) {
    const time: number = new Date().valueOf();
    this.messages.push({ text, time, isSelf });
  }
  @Mutation
  sendToDataChannel(text: string) {
    this.dc.send(text);
  }
  @Mutation
  addToOnChannelOpen(text: string) {
    this.messagesOnChannelOpen.push(text);
  }
}

export default getModule(ConferenceChat);
