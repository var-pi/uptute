<template>
  <!-- <AccountBase :title="$l('set_up.subheader')"> -->
  <div>
    <Subheader :title="$l('set_up.subheader')" />
    <PrimarySettings ref="primarySettings" :data="data" />

    <div id="buttons">
      <v-btn @click="asStudent()" id="student" rounded outlined color="accent">
        {{ $l("set_up.as_student") }}
      </v-btn>
      <v-btn @click="asTutor()" id="tutor" rounded outlined color="accent">
        {{ $l("set_up.as_tutor") }}</v-btn
      >
    </div>
  </div>
</template>

<script>
import PrimarySettings from "./PrimarySettings.vue";
import Subheader from "@/components/app/Subheader.vue";

export default {
  components: {
    PrimarySettings,
    Subheader,
  },
  data() {
    return {
      checkbox: false,
      data: {
        firstName: null,
        lastName: null,
        birthday: null,
      },
    };
  },
  methods: {
    routerPush(to) {
      this.$router.push({ name: to });
    },
    async asStudent() {
      if (!this.checkRules()) return;
      const r = await this.upgradeToUser();
      if (r.statusText == "OK") this.routerPush("StudentSettingUp");
      else alert("Check your input"); // Validate instead
    },
    async asTutor() {
      if (!this.checkRules()) return;
      const r = await this.upgradeToUser();
      if (r.statusText == "OK") this.routerPush("TutorSettingUp");
      else alert("Check your input"); // Validate instead
    },
    checkRules() {
      const primarySettings = this.$refs.primarySettings;

      const inputFields = primarySettings.$children.reduce(
        (pr, cur) => pr.concat(cur.$children[0].$children),
        []
      );
      inputFields.forEach((el) => el.isValid());
      const isValid = inputFields.every((el) => el.isValid());
      return isValid;
    },
    async upgradeToUser() {
      const data = this.data;
      console.log(data);
      const res = await this.$store.dispatch("account/upgradeToUser", { data });
      return res;
    },
    // async updateUserDetails(data) {
    //   console.log(data);
    //   if (this.isUpdating) return;
    //   this.isUpdating = true;
    //   await this.$store.dispatch("account/updateUserDetails", { data });
    //   this.isUpdating = false;
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

// ::v-deep {
//   #buttonWrapper {
//     display: none;
//   }
// }

#buttons {
  @include flexbox;
  margin-top: 3rem;
  #student {
    border-radius: 15px 0 0 15px;
    border-right: 0px;
  }
  #tutor {
    border-radius: 0 15px 15px 0;
    border-left: 1px dashed var(--v-accent-base);
  }
}
</style>

