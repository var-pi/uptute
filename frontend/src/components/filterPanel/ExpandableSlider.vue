<template>
  <BaseComponent
    ref="base"
    :label="label"
    :text="text"
    :backgroundColor="backgroundColor"
    :borderRadius="borderRadius"
    :flat="flat"
  >
    <div id="wrapper">
      <v-range-slider
        v-if="Array.isArray(def)"
        v-model="input"
        :min="getMin()"
        :max="getMax()"
        step="1"
        thumb-label="always"
        :thumb-size="25"
        color="accent"
      />
      <v-slider
        v-else
        v-model="input"
        :min="getMin()"
        :max="getMax()"
        step="1"
        thumb-label="always"
        :thumb-size="25"
        color="accent"
      />
    </div>
  </BaseComponent>
</template>

<script>
import { refresh, isValid, convert, watch } from "./store.js";
import BaseComponent from "./ExpansionBaseComponent.vue";

export default {
  components: {
    BaseComponent,
  },
  data() {
    return {
      input: this.value,
      def: JSON.parse(JSON.stringify(this.value)),
    };
  },
  props: [
    "value",
    "label",
    "text",
    "converter",
    "rules",
    "min",
    "max",
    "backgroundColor",
    "flat",
    "borderRadius",
  ],
  methods: {
    refresh,
    isValid,
    convert,
    getMin() {
      return this.min ?? 1;
    },
    getMax() {
      return this.max ?? 10;
    },
  },
  watch,
};
</script>
<style lang="scss" scoped>
#wrapper {
  padding-top: 2rem;
}
</style>
