<template>
  <BtnBase
    @click="$emit('click')"
    :class="{ isToggled: isToggled, isOpener: isOpener }"
  />
</template>

<script lang="ts">
import BtnBase from "@/components/conference/centerColumn/bars/BtnBase.vue";

import { Vue, Component, InjectReactive, Prop } from "vue-property-decorator";

@Component({ components: { BtnBase } })
export default class TopBtnBase extends Vue {
  @InjectReactive() readonly isToggled!: boolean;
  @Prop({ type: Boolean, default: true }) readonly isOpener!: boolean;
}
</script>

<style lang="scss" scoped>
.isToggled.isOpener,
:not(.isToggled):not(.isOpener) {
  transform: scale(0);
}
</style>
