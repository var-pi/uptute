<template>
  <VideoBase :isLocal="true" :muted="true" />
</template>

<script lang="ts">
import VideoBase from "@/components/conference/centerColumn/video/VideoBase.vue";

import ToggleStore from "@/store/modules/conference/toggleStore";
import Main from "@/store/modules/conference/main";
import { Vue, Component, Watch } from "vue-property-decorator";

@Component({ components: { VideoBase } })
export default class LocalVideo extends Vue {
  ToggleStore = ToggleStore;

  @Watch("ToggleStore.isToggled.bottom.camOff")
  onCamOffToggle(isCamOff: boolean) {
    Main.toggleCam(!isCamOff);
  }
  @Watch("ToggleStore.isToggled.bottom.micOff")
  onMicOffToggle(isMicOff: boolean) {
    Main.toggleMic(!isMicOff);
  }
}
</script>
