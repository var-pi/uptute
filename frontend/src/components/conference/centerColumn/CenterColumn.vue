<template>
  <div
    id="centerColumn"
    :class="{
      hideToLeft: pos == -1,
      hideToRight: pos == 1,
      nudgeToRight: isNudgedRight,
      nudgeToLeft: isNudgedLeft,
    }"
  >
    <TopBar />
    <Videos />
    <BottomBar />
  </div>
</template>

<script lang="ts">
import TopBar from "@/components/conference/centerColumn/bars/top/Bar.vue";
import Videos from "@/components/conference/centerColumn/video/Videos.vue";
import BottomBar from "@/components/conference/centerColumn/bars/bottom/Bar.vue";

import LayoutHandler from "@/store/modules/conference/layoutHandler";
import ToggleStore from "@/store/modules/conference/toggleStore";
import { Vue, Component } from "vue-property-decorator";
@Component({ components: { TopBar, Videos, BottomBar } })
export default class ConferenceCenterColumn extends Vue {
  get pos() {
    return LayoutHandler.centerColumnPos;
  }
  get isNudgedRight() {
    return (
      LayoutHandler.centerColumnPos == 0 && ToggleStore.isToggled.top.settings
    );
  }
  get isNudgedLeft() {
    return LayoutHandler.centerColumnPos == 0 && ToggleStore.isToggled.top.chat;
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#centerColumn {
  @include flexbox(column);
  height: 100vh;
  position: absolute;

  transition: transform 1s;
  &.nudgeToRight {
    transform: translate(calc((100vw - 100%) / 2));
  }
  &.nudgeToLeft {
    transform: translate(calc(-1 * (100vw - 100%) / 2));
  }
  &.hideToRight {
    transform: translate(100vw);
  }
  &.hideToLeft {
    transform: translate(-100vw);
  }
}
</style>
