<template>
  <div
    ref="bar"
    id="buttons"
    :class="{ isTopBar: isTopBar, isVisible: isVisible }"
    :style="`--transitionTime: ${transitionTime}ms;`"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import LayoutHandler from "@/store/modules/conference/layoutHandler";
import {
  Vue,
  Component,
  Ref,
  Prop,
  Watch,
  Inject,
} from "vue-property-decorator";

@Component
export default class BarBase extends Vue {
  @Ref() readonly bar!: HTMLDivElement;

  visibilityCounter: number = 0;
  hideTime: number = 1250;
  transitionIds: number[] = [];

  @Inject() readonly transitionTime!: number;
  @Prop(Boolean) readonly isTopBar!: boolean;

  get isVisible(): boolean {
    return this.visibilityCounter > 0;
  }

  mounted(): void {
    this.setBarEl();
    this.setBarState();

    addEventListener("mousemove", this.onMouseMove);
  }
  beforeUnmount(): void {
    removeEventListener("mousemove", this.onMouseMove);
  }

  onMouseMove(): void {
    this.visibilityCounter++;
    setTimeout(() => this.visibilityCounter--, this.hideTime);
  }

  setBarEl() {
    LayoutHandler.setbarEl({ isTop: this.isTopBar, el: this.$el });
  }
  setBarState(): void {
    LayoutHandler.setBarState({ isTop: this.isTopBar, val: this.isVisible });
  }

  @Watch("isVisible")
  onIsVisibleChange = (): void => this.setBarState();
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#buttons {
  transition: transform var(--transitionTime);
  flex: 0;
  $padding: 6px;
  @include flexbox(row);
  width: 100%;
  padding-right: $padding;
  padding-left: $padding;
  position: absolute;

  &.isVisible {
    transition: transform var(--transitionTime) calc(var(--transitionTime) / 2);
  }

  &.isTopBar {
    padding-top: $padding;
    top: 0px;
    &:not(.isVisible) {
      transform: translateY(-100%);
    }
  }
  &:not(.isTopBar) {
    padding-bottom: $padding;
    bottom: 0px;
    &:not(.isVisible) {
      transform: translateY(100%);
    }
  }
}
</style>
