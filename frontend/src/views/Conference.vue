<template>
  <div id="conferenceWrapper">
    <PreConference v-if="$store.state.conferenceMain.roomRef == undefined" />
    <Interface v-if="$store.state.conferenceMain.roomRef != undefined" />
  </div>
</template>

<script>
import PreConference from "@/components/conference/preConference/PreConference.vue";
import Interface from "@/components/conference/Interface.vue";
export default {
  components: { PreConference, Interface },
  async mounted() {
    this.$vuetify.theme.dark = true;
  },
};
</script>

<style>
#conferenceWrapper {
  overflow: hidden;
}
</style>
