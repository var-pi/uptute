<template>
  <v-expansion-panel
    ref="panel"
    class="panel"
    :class="{ errorMovement: errorAnim }"
    :style="
      `--displayShadow: ${flat ? 'none' : 'flex'};
        --backgroundColor: ${backgroundColor};
        --borderRadius: ${borderRadius}`
    "
  >
    <v-expansion-panel-header hover="false" :class="{ errorColor: error }">
      {{ label }}
      <div class="text-right mr-3 secondary--text text--darken-2">
        {{ text }}
      </div>
    </v-expansion-panel-header>
    <v-expansion-panel-content id="expPanelContent">
      <slot />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
export default {
  data: () => ({
    error: false,
    errorAnim: false,
  }),
  props: {
    label: String, // panel's label
    text: [Number, String], // panel's text
    flat: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: "var(--v-card-base)",
    },
    borderRadius: {
      type: String,
      default: "15px",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/errorStyles.scss";
@import "@/scss/mixins.scss";

.panel {
  transition: transform 400ms;
  margin: 0;
  background-color: var(--backgroundColor) !important;

  border-radius: 0;
  &::before {
    @include box-shadow();
    display: var(--displayShadow);
    content: "";
    z-index: -1;
  }
  border-radius: var(--borderRadius) !important;

  // border-radius: inherit !important;
  .v-expansion-panel-header {
    background-color: transparent;

    border-radius: inherit;
  }
  &:hover {
    transform: scale(0.95);
  }
}

::v-deep {
  .v-slider__track-container .v-slider__track-background.primary {
    background: var(--v-secondary-darken1) !important;
  }
}
</style>

