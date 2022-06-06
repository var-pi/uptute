<template>
  <div
    class="textInput"
    ref="textInput"
    :class="{ errorMovement: errorAnim, errorColor: error }"
    :style="
      `--displayShadow: ${flat ? 'none' : 'flex'};
      --backgroundColor: ${backgroundColor}; 
      --borderRadius: ${borderRadius}`
    "
  >
    <!-- :rules="rules(input)" -->
    <div
      class="slot"
      ref="slot"
      :style="`paddingRight:${img ? '30px' : '0px'}`"
    >
      <textarea
        v-if="area"
        type="text"
        class="input"
        rows="1"
        :class="{ active: input != '' && input != null }"
        v-model="input"
        ref="textarea"
      />
      <input
        v-else
        type="text"
        class="input"
        :class="{ active: input != '' && input != null }"
        v-model="input"
      />
      <label>{{ label }}</label>
      <img v-if="img" :src="getImg(img)" alt="" />

      <div
        v-bind:class="{ visible: ifErrMsgVisible() }"
        ref="errMsg"
        id="errMsg"
      >
        {{ errMsgUsed }}
      </div>
    </div>
  </div>
</template>

<script>
import { refresh } from "./store.js";
export default {
  data() {
    return {
      error: false,
      errorAnim: false,
      input: this.value,
      def: JSON.parse(JSON.stringify(this.value ?? "")),
      errMsgUsed: "",
    };
  },
  props: {
    value: String,
    rules: Function, // validation, always true if undef
    label: String, // panel's label
    area: Boolean, // changes to textarea
    img: String,
    flat: {
      type: Boolean,
      default: false,
    },
    backgroundColor: {
      type: String,
      default: "var(--v-card-base)",
    },
    borderRadius: {
      type: String,
      default: "15px",
    },
    errMsg: {
      type: String,
      default: "",
    },
  },
  mounted() {
    const self = this;
    this.$refs.errMsg.addEventListener("transitionstart", transitionStart);
    this.$refs.errMsg.addEventListener("transitionend", transitionEnd);

    function transitionStart() {
      if (self.ifErrMsgVisible()) self.errMsgUsed = self.errMsg;
    }
    function transitionEnd() {
      if (!self.ifErrMsgVisible()) self.errMsgUsed = self.errMsg;
    }
  },
  watch: {
    input: function(val) {
      if (this.area) {
        const el = this.$refs.textarea;
        el.style.height = "auto";
        this.$nextTick(() => (el.style.height = el.scrollHeight + "px"));
      }
      if (this.rules != undefined && this.rules(this.input)) this.error = false;
      this.$emit("input", val);
    },
    value: function(val) {
      this.input = val;
    },
  },
  methods: {
    refresh,
    isValid() {
      let val = true;
      if (this.rules !== undefined) val = this.rules(this.input);
      this.errorAnim = false;
      setTimeout(() => {
        this.errorAnim = !val;
      }, 50);
      this.error = !val;
      return val;
    },
    getImg(img) {
      return require(`@/assets/icons/${img}.svg`);
    },
    ifErrMsgVisible() {
      const self = this;

      return !ifEmpty() && !ifReplaceErr();

      function ifEmpty() {
        return !self.errMsg || self.errMsg.length == 0;
      }
      function ifReplaceErr() {
        return self.errMsg == "" || self.errMsgUsed == ""
          ? false
          : self.errMsg != self.errMsgUsed;
      }
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/scss/errorStyles.scss";
@import "@/scss/mixins.scss";

.textInput {
  $color-main: var(--backgroundColor);
  $color-sec: var(--v-secondary-darken2);
  border-radius: var(--borderRadius) !important;
  position: relative;

  &::before {
    @include box-shadow();
    display: var(--displayShadow);
    content: "";
    @include fill-parent(0);
    border-radius: inherit;
    z-index: -1;
  }

  &:not(.errorColor) {
    background-color: $color-main !important;
  }
  &.errorColor {
    input {
      border-color: var(--v-error-base) !important;
    }
    label {
      color: var(--v-error-base) !important;
    }
  }

  width: 100%;
  height: max-content;

  transition: transform 300ms;

  &:hover {
    transform: scale(0.95);
  }

  .slot {
    background: inherit;
    position: relative;
    width: 90%;
    height: max-content;
    margin: auto;
    z-index: 1;

    .input {
      display: block;
      border: 1px solid;
      border-color: $color-sec;
      border-radius: 15px;
      width: 100%;
      margin: 18px 0px;
      padding: 10px;
      background: inherit;
      &:focus {
        outline: none;
      }
      &:focus ~ label,
      &.active ~ label {
        transform: scale(0.8) translateY(-50%);
        top: 0;
      }
    }
    textarea {
      resize: none;
      overflow: hidden;
    }
    label {
      position: absolute;
      background: inherit;
      border-radius: 15px;
      padding: 0 3px 0 3px;
      left: 0.75em;
      color: $color-sec;
      pointer-events: none;
      transform-origin: top left;
      transform: translateY(-50%);
      top: 50%;

      transition: transform, top 0.25s ease-in-out;
    }
    img {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
    }
    #errMsg {
      z-index: -1;
      width: 100%;
      font-size: 12px;
      text-align: left;
      padding: 0 12px;
      position: absolute;
      color: var(--v-error-base);
      opacity: 0;
      bottom: 0px;
      transition: 300ms all;
      &.visible {
        opacity: 1;
        bottom: -18px;
      }
    }
  }
}
</style>

