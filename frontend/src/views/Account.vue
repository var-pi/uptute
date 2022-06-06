<template>
  <Background>
    <!-- <PageButtons
      :buttons="[
        {
          icon: 'mdi-account-circle',
          label: $l('acc_pages.profile'),
          path: 'Profile',
        },
        {
          icon: 'mdi-calendar-clock',
          label: $l('acc_pages.calendar'),
          path: 'Calendar',
        },
        {
          icon: 'mdi-calendar-check',
          label: $l('acc_pages.logs'),
          path: 'Logs',
        },
        {
          icon: 'mdi-account-cog',
          label: $l('acc_pages.settings'),
          path: 'Settings',
        },
      ]"
    /> -->

    <!-- !!!!!!!!!!!!!!!!!!! -->
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </Background>
</template>

<script>
import Background from "@/components/global/background/Background.vue";
// import PageButtons from "@/components/account/PageButtons.vue";

import Profile from "@/components/account/Profile.vue";
import Calendar from "@/components/account/Calendar.vue";
import Logs from "@/components/account/Logs.vue";
import Settings from "@/components/account/Settings.vue";

export default {
  permisions: {
    roles: ["ROLE_STUDENT"],
    redirect: "LogIn",
  },
  children: [
    {
      name: "Profile",
      path: "profile",
      component: Profile,
    },
    {
      name: "Calendar",
      path: "calendar",
      component: Calendar,
    },
    {
      name: "Logs",
      path: "logs",
      component: Logs,
    },
    {
      name: "Settings",
      path: "settings",
      component: Settings,
    },
  ],
  components: {
    Background,
    // PageButtons,
  },
};
</script>

