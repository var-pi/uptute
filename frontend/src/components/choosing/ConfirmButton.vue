<template>
  <Dialog>
    <template v-slot:object>
      <v-btn rounded outlined color="accent" @click="acceptOffer()">
        {{ $l("booking.confirm") }}
      </v-btn>
    </template>

    <template v-slot:title>
      {{ $l("booking.dialog.title") }}
    </template>

    <template v-slot:text>
      {{ $l("booking.dialog.text") }}
    </template>
  </Dialog>
</template>

<script>
import Dialog from "@/components/global/Dialog.vue";

export default {
  components: {
    Dialog,
  },
  props: {
    link: String,
    tutor: Object,
  },
  methods: {
    acceptOffer() {
      console.log("!!!");
      console.log(this.tutor);
      this.$store.dispatch("lesson/student/accept", {
        offerLogId: this.tutor.offerLog,
      });
    },
  },
};
</script>
