<template>
  <BtnBase @click="ToggleStore.toggle({ side: 'bottom', name: 'camOff' })" />
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
export default class CamOffBtn extends Vue {
  ToggleStore = ToggleStore;

  @ProvideReactive() get isToggled() {
    return ToggleStore.isToggled.bottom.camOff;
  }
  @Provide() icons: Icons = { on: "video-off", off: "video" };
}
</script>
