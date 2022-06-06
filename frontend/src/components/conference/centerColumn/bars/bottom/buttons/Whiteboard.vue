<template>
  <BtnBase
    @click="ToggleStore.toggle({ side: 'bottom', name: 'whiteboard' })"
  />
</template>

<script lang="ts">
import BtnBase from "@/components/conference/centerColumn/bars/BtnBase.vue";

import ToggleStore from "@/store/modules/conference/toggleStore";
import { Icons } from "@/components/conference/types";
import {
  Vue,
  Component,
  ProvideReactive,
  Provide,
} from "vue-property-decorator";

@Component({ components: { BtnBase } })
export default class WhiteboardBtn extends Vue {
  ToggleStore = ToggleStore;

  @ProvideReactive() get isToggled() {
    return ToggleStore.isToggled.bottom.whiteboard;
  }
  @Provide() icons: Icons = { on: "window-close", off: "draw" };
}
</script>
