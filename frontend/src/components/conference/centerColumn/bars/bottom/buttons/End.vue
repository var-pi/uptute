<template>
  <BtnBase @click="ToggleStore.toggle({ side: 'bottom', name: 'end' })" />
</template>

<script lang="ts">
import BtnBase from "@/components/conference/centerColumn/bars/BtnBase.vue";

import ToggleStore from "@/store/modules/conference/toggleStore";
import { Icons } from "@/components/conference/types";
import {
  Vue,
  Component,
  Provide,
  ProvideReactive,
} from "vue-property-decorator";

@Component({ components: { BtnBase } })
export default class EndBtn extends Vue {
  ToggleStore = ToggleStore;

  @ProvideReactive()
  get isToggled() {
    return ToggleStore.isToggled.bottom.end;
  }
  @Provide() icons: Icons = { on: "phone-hangup", off: "phone-hangup" };
  @Provide() bgColor = "var(--v-error-darken1)";
}
</script>
