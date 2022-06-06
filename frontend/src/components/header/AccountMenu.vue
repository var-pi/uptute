<template>
  <HeaderMenu
    color="#000"
    textColor="var(--v-background-base)"
    borderRadius="15px"
    border="none"
    justifyContent="flex-end"
    paddingTop="10px"
    transformOrigin="right top"
    :onHover="false"
  >
    <template v-slot:title>
      <v-icon id="account" class="headerCircle">mdi-account-circle</v-icon>
    </template>

    <template v-slot:content>
      <!-- <v-list-item>
        <v-btn text @click="goTo('Profile')">
          <v-icon>mdi-account-circle</v-icon>
          {{ $l("acc_pages.profile") }}
        </v-btn>
      </v-list-item> -->
      <!-- <v-list-item>
        <v-btn text @click="goTo('Calendar')">
          <v-icon>mdi-calendar-clock</v-icon>
          {{ $l("acc_pages.calendar") }}
        </v-btn>
      </v-list-item> -->
      <!-- <v-list-item>
        <v-btn text @click="goTo('Logs')">
          <v-icon>mdi-calendar-check</v-icon>
          {{ $l("acc_pages.logs") }}
        </v-btn>
      </v-list-item> -->
      <v-list-item>
        <v-btn text @click="goTo('Settings')">
          <v-icon>mdi-account-cog</v-icon>
          {{ $l("acc_pages.settings") }}
        </v-btn>
      </v-list-item>
      <v-list-item>
        <v-btn text @click="logout()" id="logOut">
          <v-icon>mdi-logout</v-icon>
          {{ $l("acc_pages.log_out") }}
        </v-btn>
      </v-list-item>
    </template>
  </HeaderMenu>
</template>

<script>
import HeaderMenu from "@/components/header/HeaderMenu.vue";

export default {
  components: {
    HeaderMenu,
  },
  methods: {
    goTo(pageName) {
      if (this.$route.name !== pageName) this.$router.push({ name: pageName });
    },
    logout() {
      this.$store.dispatch("auth/logout");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/scss/mixins.scss";

.v-icon#account {
  color: var(--v-background-base);
  // font-size: 30px;
  cursor: pointer;
  @include hoverOpacity();
}
#logOut {
  //   background: var(--v-error-base);
  &,
  .v-icon {
    color: var(--v-accent-base) !important;
  }
}
.v-btn {
  width: fit-content !important;
}
</style>

