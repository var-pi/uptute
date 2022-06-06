<template>
  <button @click="$emit('click')" :style="`--background: ${bgColor};`">
    <v-icon color="light"> mdi-{{ curIcon }} </v-icon>
  </button>
</template>

<script lang="ts">
import { Icons } from "@/components/conference/types";
import {
  Vue,
  Component,
  Watch,
  Inject,
  InjectReactive,
} from "vue-property-decorator";

@Component
export default class BtnBase extends Vue {
  curIcon: string = "";

  @Inject({ default: "var(--v-btnOn-base)" }) readonly bgColor!: string;
  @Inject() readonly icons!: Icons;
  @InjectReactive() readonly isToggled!: boolean;

  mounted(): void {
    this.setCurIcon();
  }

  setCurIcon(): void {
    const type: string = this.isToggled ? "on" : "off";
    this.curIcon = this.icons[type];
  }

  @Watch("isToggled")
  onIsToggledChange = (): void => this.setCurIcon();
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

button {
  @include box-size(fit-content);
  padding: 12px !important;
  border-radius: 50%;
  background-color: var(--background);
  margin: 6px;
  outline: 2px solid #ffffff00;

  transition: all 300ms;

  &:hover:not(:focus) {
    border-radius: 15px;
    .v-icon {
      color: var(--v-accent-base) !important;
    }
  }
  .v-icon {
    color: var(--v-light-base) !important;
  }
}
</style>
