<template>
  <div id="header">
    <TopBtnBase
      @click="ToggleStore.toggle({ side: path.side, name: path.name })"
      :isOpener="false"
      :class="{ isLeft: isLeft }"
      id="close"
    />
  </div>
</template>

<script lang="ts">
import TopBtnBase from "@/components/conference/centerColumn/bars/top/TopBtnBase.vue";
import { ButtonToggleEvent, Icons } from "@/components/conference/types";

import ToggleStore from "@/store/modules/conference/toggleStore";
import {
  Vue,
  Component,
  ProvideReactive,
  Provide,
  Inject,
} from "vue-property-decorator";

@Component({ components: { TopBtnBase } })
export default class ConfrenceSidePanelHeaderBar extends Vue {
  ToggleStore = ToggleStore;

  @Inject() readonly path!: ButtonToggleEvent;
  @Inject() readonly isLeft!: boolean;

  @ProvideReactive() get isToggled() {
    return ToggleStore.isToggled[this.path.side][this.path.name];
  }
  @Provide() icons: Icons = { on: "window-close", off: "window-close" };
  @Provide() bgColor: string = "var(--v-card-base)";
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#header {
  position: absolute;
  width: 100%;
  height: fit-content;
  border-radius: 15px 15px 0 0;
  @include flexbox();
  button#close {
    margin: 3px;
    opacity: 0.5;
    &.isLeft {
      margin-left: auto;
    }
    &:not(.isLeft) {
      margin-right: auto;
    }

    &:hover {
      opacity: 1;
    }
  }
}
</style>
