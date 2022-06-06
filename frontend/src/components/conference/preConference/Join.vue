<template>
  <Dialog>
    <template v-slot:object>
      <v-btn rounded outlined color="accent">Join</v-btn>
    </template>

    <template v-slot:title id="title"> Room id </template>

    <template v-slot:text>
      <TextField
        v-model="roomId"
        label="Room id"
        :rules="(v) => true"
        :borderRadius="'15px 15px 15px 15px'"
        :flat="false"
        :errMsg="errMsg"
        required
      />
      <v-btn rounded outlined color="accent" class="mt-4" @click="emitJoin()"
        >Enter</v-btn
      >
    </template>
  </Dialog>
</template>

<script>
import TextField from "@/components/filterPanel/TextField.vue";
import Dialog from "@/components/global/Dialog.vue";
export default {
  data() {
    return {
      roomId: "",
      errMsg: "",
    };
  },
  components: {
    Dialog,
    TextField,
  },
  methods: {
    emitJoin() {
      this.$emit("join", this.roomId);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";
</style>
