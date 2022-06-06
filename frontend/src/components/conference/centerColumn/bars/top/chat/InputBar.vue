<template>
  <div id="bar">
    <textarea
      @keypress="onTextareaKey"
      id="inputLine"
      type="text"
      ref="textarea"
      rows="1"
      v-model="input"
    />
    <button @click="sendMessage" id="send">
      <v-icon class="icon"> mdi-send </v-icon>
    </button>
  </div>
</template>

<script lang="ts">
import Chat from "@/store/modules/conference/chat";

import { Vue, Component, Ref, Watch } from "vue-property-decorator";

@Component
export default class ConferenceChatInputBar extends Vue {
  @Ref("textarea") textareaRef!: HTMLTextAreaElement;

  input: string = "";
  maxInputHeightPercent: number = 40;

  onTextareaKey(e: KeyboardEvent): void {
    if (e.key == "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isEmpty(this.input)) this.sendMessage();
    }

    function isEmpty(input: string) {
      return !/\S/.test(input);
    }
  }
  sendMessage(): void {
    Chat.sendMessage(this.input);
    this.input = "";
    this.textareaRef.focus();
    this.$nextTick(() => this.resizeTextArea());
  }
  resizeTextArea(): void {
    const docHeight: number = document.body.clientHeight;
    const maxHeight: number = (docHeight * this.maxInputHeightPercent) / 100;
    this.textareaRef.style.height = "auto";
    const scrollH: number = this.textareaRef.scrollHeight;
    this.$nextTick(() => {
      const h: number = scrollH < maxHeight ? scrollH + 2.5 : maxHeight + 2.5;
      this.textareaRef.style.height = h + "px";
    });
  }

  @Watch("input")
  onInputChange = (): void => this.resizeTextArea();
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#bar {
  @include flexbox(row);
  height: fit-content;
  width: 100%;
  max-height: 80%;
  margin-top: 12px;

  #inputLine {
    resize: none;
    flex: 1;
    border-radius: 15px;
    padding: 6px 12px;
    color: var(--v-light-base);
    border: 1px var(--v-light-darken4) solid;
    outline: none;
    overflow: auto;

    transition: border 300ms;
    &:hover,
    &:focus {
      border: 1px var(--v-accent-darken2) solid;
    }
  }
  #send {
    @include box-size(36px);
    margin-left: 12px;
    .icon {
      transition: color 300ms;
      color: var(--v-accent-base);
    }
    &:hover .icon {
      color: var(--v-accent-darken2);
    }
  }
}
</style>
