<template>
  <v-menu
    offset-y
    :open-on-hover="onHover"
    hide-on-scroll
    eager
    content-class="content"
    :attach="'#' + id"
    transition="scale-transition"
    v-model="showMenu"
    :close-on-content-click="onHover"
  >
    <template v-slot:activator="{ on, attrs }">
      <div
        :style="
          `--justifyContent: ${justifyContent}; 
          --paddingTop: ${paddingTop}; 
          --transformOrigin: ${transformOrigin};
          --rightDistance: ${rightDistance}px;
          --padding: ${padding};
         `
        "
        v-bind="attrs"
        v-on="on"
        :id="id"
        class="title"
        ref="title"
        :class="{
          triangle: paddingTop !== '0' && paddingTop !== '0px',
        }"
      >
        <slot name="title" />
      </div>
    </template>

    <v-list
      eager
      ref="list"
      :style="
        `--color: ${color}; 
        --textColor: ${textColor}; 
        --borderRadius: ${borderRadius}; 
        --border: ${border};
        `
      "
    >
      <div id="trianglePointer" />
      <slot name="content" />
    </v-list>
  </v-menu>
</template>

<script>
import { getId } from "@/plugins/GlobalMethods.js";

export default {
  props: {
    color: String,
    textColor: String,
    borderRadius: String,
    border: String,
    padding: {
      type: String,
      default: "0px",
    },
    justifyContent: {
      type: String,
      default: "center",
    },
    paddingTop: {
      type: String,
      default: "0px",
    },
    transformOrigin: {
      type: String,
      default: "center top ",
    },
    onHover: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      id: "",
      showMenu: false,
      rightDistance: 0,
    };
  },
  methods: {
    resized() {
      setTimeout(() => {
        this.rightDistance =
          window.innerWidth - this.$refs.title.getBoundingClientRect().right;
      }, 100);
    },
  },
  beforeMount() {
    this.id = getId();
  },
  mounted() {
    window.addEventListener("resize", this.resized);
    window.addEventListener("orientationchange", this.resized);
    this.resized();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.resized);
    window.removeEventListener("orientationchange", this.resized);
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";
$toMVWidth: 500px;
$triangleOffset: 30px;

::v-deep {
  div.title > span {
    @include hoverOpacity();
  }
}

div.title {
  position: relative;
  height: 100%;
  cursor: default;
  padding: var(--padding);
  @include flexbox();

  justify-content: var(--justifyContent);

  color: var(--v-accent-base) !important;

  text-transform: uppercase;
  text-align: center;
  letter-spacing: 3px;
  font-weight: 500;

  letter-spacing: 3px !important;

  &.triangle .v-menu__content {
    right: calc(50% - #{$triangleOffset}) !important;
    $moreToRight: 10px;
    @media (max-width: $toMVWidth) {
      right: calc(50% - var(--rightDistance) - #{$moreToRight}) !important;
    }
    #trianglePointer {
      position: absolute;
      top: -10px;
      width: 0;
      height: 0;

      $triangleSize: 10px;

      right: $triangleOffset - $triangleSize;

      @media (max-width: $toMVWidth) {
        right: calc(var(--rightDistance) - #{$triangleSize} + #{$moreToRight});
      }

      border-top: $triangleSize solid transparent;

      border-left: $triangleSize solid transparent;
      border-right: $triangleSize solid transparent;

      border-bottom: $triangleSize solid #000;
    }
  }
  &:not(.triangle) {
    .v-list {
      padding-top: 0;
    }
  }
  .v-menu__content {
    top: 100% !important;
    left: auto !important;
    position: absolute;
    overflow: visible !important;
    min-width: fit-content !important;
    width: fit-content !important;
    padding-top: var(--paddingTop);
    z-index: 1000;

    box-shadow: none;
    border-radius: 0px;
    transition: transform 0.3s, opacity 0.3s !important;
    transform-origin: var(--transformOrigin) !important;
    // margin-right: calc(-1 * #{$triangleOffset});
    .v-list {
      background: var(--color) !important;
      border-radius: var(--borderRadius);
      border: var(--border);
    }
  }
}

::v-deep {
  .v-list-item > * {
    width: 100%;
    &.v-btn,
    .v-btn {
      border-radius: 50px;
      width: 100%;
      color: var(--textColor) !important;
      text-transform: none;
      img,
      .v-icon {
        margin-right: 10px;
        @include box-size(1.5rem);
        color: var(--v-background-base);
      }
    }
  }
}
</style>

