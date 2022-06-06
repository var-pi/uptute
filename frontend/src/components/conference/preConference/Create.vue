<template>
  <v-btn rounded outlined class="mb-2" color="accent" @click="emitCreate()">
    Create
  </v-btn>
</template>

<script>
export default {
  methods: {
    emitCreate() {
      this.$emit("create");
    },
  },
};
</script>
