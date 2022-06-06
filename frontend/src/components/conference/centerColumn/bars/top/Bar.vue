<template>
  <BarBase :isTopBar="true">
    <SettingsBtn />
    <v-spacer />
    <ChatBtn />
  </BarBase>
</template>

<script lang="ts">
import BarBase from "@/components/conference/centerColumn/bars/BarBase.vue";
import SettingsBtn from "@/components/conference/centerColumn/bars/top/settings/Btn.vue";
import ChatBtn from "@/components/conference/centerColumn/bars/top/chat/Btn.vue";

import { Vue, Component } from "vue-property-decorator";

@Component({ components: { BarBase, SettingsBtn, ChatBtn } })
export default class TopBar extends Vue {}
</script>
