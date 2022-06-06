<template>
  <BtnBase @click="ToggleStore.toggle({ side: 'bottom', name: 'micOff' })" />
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
export default class MicOffBtn extends Vue {
  ToggleStore = ToggleStore;

  @ProvideReactive() get isToggled() {
    return ToggleStore.isToggled.bottom.micOff;
  }
  @Provide() icons: Icons = { on: "microphone-off", off: "microphone" };
}
</script>
