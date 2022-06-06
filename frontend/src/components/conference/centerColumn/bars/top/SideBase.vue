<template>
  <div
    ref="panelRef"
    id="panel"
    :class="{
      isLeft: isLeft,
      isToggled: isToggled,
      isAfterMounted: isAfterMounted,
      isFullScreen: isFullScreen,
    }"
    :style="`
    --w: ${w}px; 
    --transitionTime: ${transitionTime}ms; 
    --margin: ${margin}px;
    `"
  >
    <div id="card">
      <Header ref="headerBar" />
      <div id="content" :style="`--pt: ${topPadding}px;`">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Header from "@/components/conference/centerColumn/bars/top/HeaderBar.vue";
import { ButtonToggleEvent, ColumnName } from "@/components/conference/types";

import LayoutHandler from "@/store/modules/conference/layoutHandler";
import ToggleStore from "@/store/modules/conference/toggleStore";
import { Vue, Component, Ref, Inject, Watch } from "vue-property-decorator";

@Component({ components: { Header } })
export default class SideBase extends Vue {
  @Inject() readonly transitionTime!: number;
  @Inject() readonly margin!: number;
  @Inject() readonly isLeft!: boolean;
  @Inject() readonly path!: ButtonToggleEvent;

  get isToggled(): boolean {
    return ToggleStore.isToggled[this.path.side][this.path.name];
  }
  get isFullScreen(): boolean {
    return LayoutHandler.centerColumnPos == (this.isLeft ? 1 : -1);
  }

  @Ref() readonly panelRef!: HTMLDivElement;
  @Ref("headerBar") readonly headerBarRef!: Header;

  private initialW: number = 0;

  public isAfterMounted: boolean = false; // for HTML
  public w: number = 0; // for HTML
  public topPadding: number = 0; // for HTML

  mounted(): void {
    const self = this;

    this.topPadding = this.headerBarRef.$el.clientHeight;
    this.w = this.$el.clientWidth;
    instanceElToLayoutHandler();

    setTimeout(() => (this.isAfterMounted = true));

    function instanceElToLayoutHandler() {
      const name: ColumnName = self.isLeft ? "left" : "right";
      LayoutHandler.setColumnEl({ name, el: self.$el });
    }
  }

  @Watch("isFullScreen")
  async smoothResize(isFullScreen: boolean): Promise<void> {
    const self = this;

    if (isFullScreen) this.initialW = this.$el.clientWidth;

    if (LayoutHandler.centerColumnPos == 0)
      await new Promise((r) => setTimeout(() => r(""), this.transitionTime));

    smoothWidthChange(1000); // 1000 => instant change

    function smoothWidthChange(delta: number) {
      const id: number = setInterval(() => frameWidthChange(id));

      function frameWidthChange(id: number): void {
        const curW: number = self.$el.clientWidth;
        const isExpand: boolean = self.isFullScreen;

        const targetW: number = isExpand ? window.innerWidth : self.initialW;
        const ifIteerate: boolean = isExpand ? curW < targetW : curW > targetW;

        if (ifIteerate) self.w = curW + (isExpand ? +delta : -delta);
        else {
          self.w = targetW;
          clearInterval(id);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#panel {
  height: 100vh;
  color: var(--v-light-base);
  padding: var(--margin);
  max-width: 100vw;
  position: absolute;
  z-index: 10;
  &.isAfterMounted {
    width: var(--w);

    $t: var(--transitionTime);
    transition: transform $t;
    &.isToggled {
      transition: transform $t calc($t / 2);
    }
    &:not(.isFullScreen):not(.isToggled) {
      transition: transform $t, padding $t $t;
    }
  }

  &.isLeft {
    right: 100vw;
    &.isToggled {
      transform: translate(var(--w));
    }
    &:not(.isFullScreen) {
      padding-right: 0px;
    }
  }
  &:not(.isLeft) {
    left: 100vw;
    &.isToggled {
      transform: translate(calc(-1 * var(--w)));
    }
    &:not(.isFullScreen) {
      padding-left: 0px;
    }
  }

  #card {
    height: 100%;
    background: var(--v-card-base);
    border-radius: 15px;
    position: relative;

    #content {
      @include box-size(100%);
      padding: 12px;
      overflow: auto;
      padding-top: var(--pt);
    }
  }
}
</style>
