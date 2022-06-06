<template>
  <div>
    <Subheader :title="$l('set_up.subheader')" />
    <StudentSettings :data="data" />
    <v-btn @click="done(data)" id="done" rounded outlined color="accent">{{
      $l("set_up.button")
    }}</v-btn>
  </div>
</template>

<script>
import StudentSettings from "./StudentSettings.vue";
import Subheader from "@/components/app/Subheader.vue";

export default {
  components: {
    StudentSettings,
    Subheader,
  },
  data() {
    return {
      data: {
        grade: null,
        inProcess: false,
      },
    };
  },
  methods: {
    routerPush(to) {
      this.$router.push({ name: to });
    },
    async done(data) {
      if (this.inProcess) return;
      this.inProcess = true;
      const res = await this.$store.dispatch("account/upgradeToStudent", {
        data,
      });
      this.inProcess = false;
      if (res.statusText == "OK") this.routerPush("FindATutor");
    },
  },
};
</script>

<style lang="scss" scoped>
#done.v-btn {
  margin-top: 3rem;
}
</style>
