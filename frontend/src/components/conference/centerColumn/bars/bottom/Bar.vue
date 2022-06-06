<template>
  <BarBase :isTopBar="false">
    <div ref="wrapper">
      <MicOff />
      <CamOff />
      <End />
      <ScreenShare />
      <Whiteboard />
    </div>
  </BarBase>
</template>

<script lang="ts">
import BarBase from "@/components/conference/centerColumn/bars/BarBase.vue";

import MicOff from "@/components/conference/centerColumn/bars/bottom/buttons/MicOff.vue";
import CamOff from "@/components/conference/centerColumn/bars/bottom/buttons/CamOff.vue";
import End from "@/components/conference/centerColumn/bars/bottom/buttons/End.vue";
import ScreenShare from "@/components/conference/centerColumn/bars/bottom/buttons/ScreenShare.vue";
import Whiteboard from "@/components/conference/centerColumn/bars/bottom/buttons/Whiteboard.vue";

import LayoutHandler from "@/store/modules/conference/layoutHandler";
import { Vue, Component, Ref } from "vue-property-decorator";

@Component({
  components: { BarBase, MicOff, CamOff, End, ScreenShare, Whiteboard },
})
export default class BottomBar extends Vue {
  @Ref("wrapper") wrapperEl!: Element;

  mounted() {
    LayoutHandler.setColumnEl({ name: "center", el: this.wrapperEl });
  }
}
</script>
