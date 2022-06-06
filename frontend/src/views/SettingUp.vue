<template>
  <Background>
    <BackgroundCard>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </BackgroundCard>
  </Background>
</template>

<script>
import Background from "@/components/global/background/Background.vue";
import BackgroundCard from "@/components/global/background/BackgroundCard.vue";
import PrimarySettingUp from "@/components/account/PrimarySettingUp.vue";
import StudentSettingUp from "@/components/account/StudentSettingUp.vue";
import TutorSettingUp from "@/components/account/TutorSettingUp.vue";

export default {
  children: [
    {
      name: "PrimarySettingUp",
      path: "primary",
      component: PrimarySettingUp,
    },
    {
      name: "StudentSettingUp",
      path: "student",
      component: StudentSettingUp,
    },
    {
      name: "TutorSettingUp",
      path: "tutor",
      component: TutorSettingUp,
    },
  ],
  components: {
    Background,
    BackgroundCard,
  },
};
</script>

<style scoped lang="scss"></style>

