<template>
  <div id="container">
    <Subheader :title="$l('acc_pages.settings')" />
    <PrimarySettings :data="data" />
    <TutorSettings :data="data" v-if="roles.includes('ROLE_TUTOR')" />
    <v-btn
      @click="updateUserDetails(data)"
      id="save"
      rounded
      outlined
      color="accent"
    >
      {{ $l("settings.save") }}</v-btn
    >
  </div>
</template>

<script>
import Subheader from "@/components/app/Subheader.vue";
import PrimarySettings from "@/components/account/PrimarySettings.vue";
import TutorSettings from "@/components/account/TutorSettings.vue";
// import { apiRequest } from "@/services/api.service.js";

export default {
  name: "Settings",
  path: "/settings",
  permisions: {
    roles: ["ROLE_STUDENT"],
    redirect: "LogIn",
  },
  components: {
    Subheader,
    PrimarySettings,
    TutorSettings,
  },
  computed: {
    roles: function() {
      return this.$store.getters["auth/roles"];
    },
  },
  data() {
    return {
      data: {},
      isUpdating: false,
    };
  },
  mounted() {
    this.getUserDetails();
  },
  methods: {
    async getUserDetails() {
      this.data = await this.$store
        .dispatch("account/getUserDetails")
        .then((r) => r.data);
    },
    async updateUserDetails(data) {
      if (this.isUpdating) return;
      this.isUpdating = true;
      await this.$store.dispatch("account/updateUserDetails", { data });
      this.isUpdating = false;
    },
  },
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

