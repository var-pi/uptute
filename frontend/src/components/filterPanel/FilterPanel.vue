<template>
  <v-expansion-panels flat id="panels" ref="panel">
    <slot />
  </v-expansion-panels>
</template>

<script>
export default {
  data() {
    return {
      inProgress: false,
    };
  },
  props: ["next"],
  methods: {
    async isValid() {
      if (this.inProgress) return;
      this.inProgress = true;
      var val = true;

      const inputFields = this.$refs.panel.$children.filter(
        (el) => !el.$el.classList.contains("notInput")
      );

      for (const el of inputFields) {
        if (!el.isValid()) val = false;
        await new Promise((res) => setTimeout(res, 100));
      }
      var nextValPromise = Promise;

      this.$emit("next", "isValid", (r) => (nextValPromise = r));

      var bool = await Promise.resolve(nextValPromise);
      if (bool == false) val = false;
      // if (!val) await new Promise((res) => setTimeout(res, 300));

      this.inProgress = false;

      return val;
    },
    refresh() {
      for (const el of this.$refs.panel.$children) {
        el.refresh();
      }
      this.$emit("next", "refresh");
    },
  },
};
</script>

<style scoped lang="scss">
.v-expansion-panels {
  border-radius: 15px;
}
</style>

