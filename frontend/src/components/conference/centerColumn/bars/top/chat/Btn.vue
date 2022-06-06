<template>
  <TopBtnBase @click="ToggleStore.toggle({ side: 'top', name: 'chat' })" />
</template>

<script lang="ts">
import TopBtnBase from "@/components/conference/centerColumn/bars/top/TopBtnBase.vue";

import ToggleStore from "@/store/modules/conference/toggleStore";
import { Icons } from "@/components/conference/types";
import {
  Vue,
  Component,
  ProvideReactive,
  Provide,
} from "vue-property-decorator";

@Component({ components: { TopBtnBase } })
export default class ChatBtn extends Vue {
  ToggleStore = ToggleStore;

  @ProvideReactive() get isToggled() {
    return ToggleStore.isToggled.top.chat;
  }
  @Provide() icons: Icons = { on: "window-close", off: "message" };
}
</script>
