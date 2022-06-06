<template>
  <v-app>
    <Navigation v-if="ifNavigation" />
    <Header v-if="ifHeader" />
    <v-main>
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </v-main>
    <!-- <MessengerChat /> -->
    <Footer v-if="ifFooter" />
  </v-app>
</template>

<script>
import { mapActions } from "vuex";
import Header from "@/components/app/Header.vue";
import Footer from "@/components/app/Footer.vue";
import Navigation from "@/components/app/Navigation.vue";
// import MessengerChat from "@/components/MessengerChat.vue";
import { apiRequest } from "@/services/api.service.js";
import rules from "@/router/rules.js";

export default {
  data: () => ({
    drawer: false,
  }),
  components: {
    Header,
    Footer,
    Navigation,
    // MessengerChat,
  },
  methods: {
    ...mapActions(["isAuth"]),
    // ---------
    async getFirstPost() {
      const res = await apiRequest({
        method: "get",
        urlEnd: `/api/auth/facebook/signin`,
      }).catch((err) => console.log(err));
      res;
    },
  },
  mounted() {
    // this.getFirstPost();
  },
  computed: {
    ifNavigation() {
      return !rules.no.navigation.includes(this.$route.name);
    },
    ifHeader() {
      return !rules.no.header.includes(this.$route.name);
    },
    ifFooter() {
      return !rules.no.footer.includes(this.$route.name);
    },
  },
};
</script>

<style lang="scss">
@import "./scss/styles.scss";
@import "./scss/mixins.scss";

:root {
  --side-margin: clamp(0.5rem, 18vw, 22rem);
}

html {
  scroll-behavior: smooth;

  @include font-size();
  body {
    height: 100%;
  }
  p,
  h3,
  div,
  span {
    font-size: 1rem;
  }
  span.v-btn__content {
    font-size: 0.9rem;
  }
  h2 {
    font-size: 1.6rem;
  }
  h1 {
    font-size: 2rem;
    color: var(--v-accent-base);
  }
  h3,
  h2,
  h1 {
    font-weight: 800;
  }
}

#app {
  * {
    font-family: "Comfortaa" !important;
  }
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: var(--v-secondary-base);
  font-size: 1.1rem;

  a:not(.v-btn) {
    color: var(--v-background-darken4);
    transition: color 500ms;
    &:hover,
    &:focus {
      color: var(--v-accent-base);
    }
  }
}
::-webkit-scrollbar {
  width: 12px;
}
::-webkit-scrollbar-track {
  background: var(--v-background-base);
}
::-webkit-scrollbar-thumb {
  background-color: var(--v-thumb-base);
  border-radius: 15px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: var(--v-thumbHover-base);
}

.fade-enter-active,
.fade-leave-active {
  transition-duration: 0.3s;
  transition-property: opacity;
  transition-timing-function: ease-in-out;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>

