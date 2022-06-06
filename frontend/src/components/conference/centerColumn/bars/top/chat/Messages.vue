<template>
  <div ref="messagesView" id="messages">
    <div ref="wrapper">
      <div
        v-for="(msg, id) in Chat.messages"
        :key="id"
        class="msgLine"
        :class="{ isSelf: msg.isSelf, hasSpaceBefore: ifSpaceBefore(id) }"
      >
        <div ref="message" class="msg">{{ msg.text }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Chat from "@/store/modules/conference/chat";

import ToggleStore from "@/store/modules/conference/toggleStore";
import { Vue, Component, Ref, Watch } from "vue-property-decorator";

@Component
export default class ConferenceChatMessages extends Vue {
  Chat = Chat;

  @Ref("messagesView") messagesViewRef!: HTMLDivElement;
  @Ref("wrapper") wrapperRef!: HTMLDivElement;
  @Ref("message") messageRefs!: HTMLDivElement[];

  maxHeightForAutoscroll: number = 300;

  get isToggled() {
    return ToggleStore.isToggled.top.chat;
  }

  ifSpaceBefore(id: number): boolean {
    if (id <= 0) return false;
    const isLastSelf: boolean = Chat.messages[id].isSelf;
    const isPrevSelf: boolean = Chat.messages[id - 1].isSelf;
    const ifPersonChanged: boolean = isLastSelf != isPrevSelf;
    return ifPersonChanged;
  }

  async tryScrollToLastMessage(isOnOpen?: boolean): Promise<void> {
    const self = this;

    const messages = Chat.messages;
    const messagesExist: boolean = messages.length > 0;
    const isOpen = this.isToggled;
    const isSelf: boolean = messages[messages.length - 1]?.isSelf == true;
    const isCloseToBottom =
      self.wrapperRef.getBoundingClientRect().bottom -
        self.messagesViewRef.getBoundingClientRect().bottom <
      self.maxHeightForAutoscroll;

    if (messagesExist && isOpen && (isSelf || isCloseToBottom || isOnOpen))
      this.$nextTick(() => scrollToLastMessage());

    function scrollToLastMessage(): void {
      const lastMessageId: number = self.messageRefs.length - 1;
      const lastMessageEl: HTMLDivElement = self.messageRefs[lastMessageId];

      const lastMessageY: number = lastMessageEl.offsetTop;
      const wrapperRefY: number = self.wrapperRef.offsetTop;

      const top: number = lastMessageY - wrapperRefY;

      self.messagesViewRef.scrollTo({ top, behavior: "smooth" });
    }
  }
  @Watch("Chat.messages")
  onMessagesChange = () => this.tryScrollToLastMessage();
  @Watch("isToggled")
  onToggleChange = () => this.tryScrollToLastMessage(true);
}
</script>

<style lang="scss" scoped>
#messages {
  $scrollbarMargin: 16px;

  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  .msgLine {
    margin: 2px 0;
    display: flex;
    &.hasSpaceBefore {
      margin-top: 18px;
    }
    .msg {
      border-radius: 15px;
      padding: 6px 12px;
      width: fit-content;
      text-align: left;
      word-break: break-word;
    }
    &.isSelf {
      justify-content: right;
      .msg {
        border: 1px var(--v-accent-darken2) solid;
        margin-left: 24px;
      }
    }
    &:not(.isSelf) {
      justify-content: left;
      .msg {
        border: 1px var(--v-light-darken4) solid;
        margin-right: 20%;
      }
    }
  }
}
</style>
