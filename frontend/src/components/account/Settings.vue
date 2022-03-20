<template>
  <div id="container">
    <Subheader :title="$l('acc_pages.settings')" />
    <PrimarySettings />
    <SecondarySettings />
    <!-- v-if="getStatus === 'TUTOR'" -->
    <!-- bind status!! -->
    <v-btn id="save" rounded outlined color="accent">
      {{ $l("settings.save") }}</v-btn
    >
  </div>
</template>

<script>
import Subheader from "@/components/app/Subheader.vue";
import PrimarySettings from "@/components/account/PrimarySettings.vue";
import SecondarySettings from "@/components/account/SecondarySettings.vue";
import { mapGetters } from "vuex";

export default {
  name: "Settings",
  path: "/settings",
  permisions: {
    roles: "ALL",
  },
  components: {
    Subheader,
    PrimarySettings,
    SecondarySettings,
  },
  computed: mapGetters(["getStatus"]),
};
</script>

<style lang="scss" scoped>
::v-deep {
  .nameAndAge {
    margin-bottom: 2rem !important;
  }
}
#container {
  padding-top: 7rem;
  padding-bottom: 2rem;
}
#save {
  margin-top: 3rem;
}
</style>
