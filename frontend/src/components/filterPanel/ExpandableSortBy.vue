<template>
  <v-expansion-panels flat>
    <ExpansionBaseComponent
      ref="base"
      v-model="input"
      :label="label"
      :text="text"
      :flat="flat"
      :borderRadius="borderRadius"
    >
      <div
        class="filter"
        v-for="item in filters"
        :key="item.name"
        :checked="input.name === item.name"
        :dir="input.dir"
        @click="change(item)"
      >
        <div class="wrapper">
          <div class="rotator">
            <v-icon class="icon">mdi-water</v-icon>
          </div>
        </div>
        <p>{{ convertor(item) }}</p>
      </div>
    </ExpansionBaseComponent>
  </v-expansion-panels>
</template>

<script>
import { refresh, isValid, convert, watch } from "./store.js";
import ExpansionBaseComponent from "./ExpansionBaseComponent.vue";

export default {
  components: {
    ExpansionBaseComponent,
  },
  data() {
    return {
      input: this.value,
      def: JSON.parse(JSON.stringify(this.value)),
    };
  },
  props: [
    "value",
    "filters",
    "label",
    "text",
    "convertor",
    "rules",
    "flat",
    "borderRadius",
  ],
  methods: {
    change(item) {
      if (this.input.name == item.name)
        this.input = {
          name: item.name,
          dir: this.input.dir === "up" ? "down" : "up",
        };
      // item.dir = item.dir === "up" ? "down" : "up";
      else this.input = { name: item.name, dir: item.dir };
    },
    refresh,
    isValid,
    convert,
  },
  watch,
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

$icon-wrapper-size: 1.5rem;
$scale: 0.4;
$transition-duration: 0.4s;
$margin-top: 0.4rem;

$side-margin: 0.8rem;

.filter {
  overflow: hidden;
  @include flexbox;
  justify-content: left;
  cursor: pointer;
  * {
    cursor: inherit;
  }
  & + & {
    margin-top: $margin-top;
  }
  .wrapper,
  .rotator,
  .icon {
    @include flexbox;
    transition: all $transition-duration ease;
  }
  .icon {
    color: var(--v-secondary-darken2);
    padding: 0 !important;
  }
  p {
    margin: 0 0 0 #{$icon-wrapper-size + $side-margin};
  }
  .wrapper {
    // position: absolute;
    @include box-size($icon-wrapper-size);
    border-radius: 50%;
    overflow: hidden;
  }
  &[checked] .icon {
    color: var(--v-accent-base);
  }
  &:not([checked]) {
    .wrapper {
      transform: scale($scale);
    }
    .icon {
      transform: scale(#{1 / $scale});
      // transform: scale(0.9);
    }
  }
  &[dir="down"] .rotator {
    transform: rotate(180deg);
  }
}
</style>

