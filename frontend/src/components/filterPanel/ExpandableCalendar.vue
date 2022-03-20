<template>
  <BaseComponent
    ref="base"
    :label="label"
    :text="text"
    :borderRadius="borderRadius"
    :flat="flat"
  >
    <v-menu
      class="menu"
      ref="menu"
      v-model="menu"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      min-width="auto"
      :menu-props="{ borderRadius: '15' }"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-text-field
          v-model="input"
          :label="$l('set_up.birth')"
          prepend-icon="mdi-calendar"
          readonly
          v-bind="attrs"
          v-on="on"
        ></v-text-field>
      </template>

      <v-date-picker
        v-model="input"
        :active-picker.sync="activePicker"
        :max="
          new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10)
        "
        min="1930-01-01"
        @change="save"
      ></v-date-picker>
    </v-menu>
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
      activePicker: null,
      menu: false,
      input: this.value,
      def: JSON.parse(JSON.stringify(this.value)),
    };
  },
  props: [
    "value",
    "label",
    "text",
    "convertor",
    "rules",
    "flat",
    "borderRadius",
  ],
  methods: {
    refresh,
    isValid,
    convert,
    save(date) {
      this.$refs.menu.save(date);
    },
  },
  watch,
};
</script>

<style lang="scss" scoped>
::v-deep {
  .v-picker__title.primary {
    background: var(--v-secondary-darken3) !important;
  }
  .v-picker {
    border-radius: 15px;
  }
  &.v-menu__content {
    border-radius: 15px !important;
  }
  ::-webkit-scrollbar-track {
    background: var(--v-secondary-base);
    margin: 10px 0;
  }
}
</style>
