<template>
  <div id="main">
    <div id="footer" ref="footer">
      <div id="footer-wrapper" ref="wrapper">
        <div id="container">
          <div id="container-text">
            <h3>{{ $l("app.footer.pages_title") }}</h3>
            <ul>
              <li v-for="page in checkRoles(pages)" :key="page.index">
                <router-link
                  class="link"
                  :to="{ path: '/' + $route.params.locale + page.route }"
                >
                  {{ $l("app.pages." + page.name) }}
                </router-link>
              </li>
            </ul>
          </div>
          <h2 id="container-header">UpTute</h2>
          <div id="container-icons">
            <v-btn
              v-for="icon in icons"
              :key="icon.index"
              icon
              :href="icon.link"
            >
              <v-icon size="24px" class="icon">
                {{ icon.img }}
              </v-icon>
            </v-btn>
          </div>
          <div id="container-reference">
            Icons made by
            <a href="https://www.freepik.com" title="Freepik"> Freepik </a>
            from
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
          <p id="container-uptute">
            &#169; UpTute {{ new Date().getFullYear() }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icons: [
        {
          img: "mdi-facebook",
          link: "https://www.facebook.com/UpTute-100775658754801",
        },
        {
          img: "mdi-instagram",
          link: "https://www.instagram.com/_uptute_/",
        },
      ],
      pages: [
        { name: "home", route: "/home", roles: ["ALL"] },
        { name: "log_in", route: "/log_in", roles: ["NONE"] },
        { name: "register", route: "/register", roles: ["NONE"] },
        {
          name: "find_a_tutor",
          route: "/find_a_tutor",
          roles: ["ROLE_STUDENT"],
        },
        {
          name: "choose_a_student",
          route: "/choose_a_student",
          roles: ["ROLE_TUTOR"],
        },
        {
          name: "account.settings",
          route: "/account/settings",
          roles: ["ROLE_STUDENT"],
        },
        { name: "terms", route: "/terms_of_use", roles: ["ALL"] },
        { name: "privacy_policy", route: "/privacy_policy", roles: ["ALL"] },
      ],
    };
  },
  computed: {
    roles: function () {
      return this.$store.getters["auth/roles"];
    },
  },
  async mounted() {
    const footer = this.$refs.footer;
    const wrapper = this.$refs.wrapper;
    new ResizeObserver(() => {
      footer.style.height = wrapper.offsetHeight + "px";
    }).observe(wrapper);
  },
  methods: {
    checkRoles(pages) {
      return pages.filter((page) => ifShow(this, page));
      function ifShow(self, page) {
        if (
          page.roles.includes("ALL") ||
          page.roles.includes("NONE" && self.roles.length == 0) ||
          page.roles.some((role) => self.roles.includes(role))
        )
          return true;
        return false;
      }
    },
    //   scrollToBottom() {
    //     window.scrollTo({ top: document.body.scrollHeight });
    //   },
  },
};
</script>

<style scoped lang="scss">
#footer {
  background-color: var(--v-primary-lighten1);
  color: var(--v-secondary-base);
  width: 100vw;
  position: absolute;
  clip: rect(0, auto, auto, 0);
}
#footer-wrapper {
  position: fixed;
  width: 100%;
  height: fit-content;
  bottom: 0;
}
#container-uptute {
  font-size: 1rem;
  margin-top: 1rem;
}
#container-text {
  text-align: left;
  .link {
    text-decoration: none;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
}
#container-icons {
  text-align: right;
}

#container {
  margin: 1rem var(--side-margin) 0;
  display: grid;
  gap: 2ch;
  grid-auto-columns: 1fr;
  grid-template-areas:
    "text header icons"
    "reference reference reference"
    "uptute uptute uptute";
  @media (max-width: 750px) {
    grid-template-areas:
      "header"
      "text"
      "icons"
      "reference"
      "uptute";
    &-text {
      justify-self: center;
      text-align: center;
    }
    &-text h3,
    &-icons {
      text-align: center;
    }
  }
  @each $child in uptute, text, icons, reference, header {
    &-#{$child} {
      grid-area: $child;
    }
  }
}

.icon {
  color: var(--v-accent-base) !important;
  &:hover {
    color: var(--v-accentHover-darken1) !important;
  }
}
</style>

