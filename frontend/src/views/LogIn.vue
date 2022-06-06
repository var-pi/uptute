<template>
  <div id="container">
    <Subheader :title="$l('auth.header.log_in')" />

    <v-card id="card">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          filled
          rounded
          v-model="email"
          :rules="emailRules"
          :label="$l('auth.email')"
          required
        ></v-text-field>
        <v-text-field
          filled
          rounded
          v-model="password"
          :rules="passwordRules"
          :type="showPassword ? 'text' : 'password'"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
          :label="$l('auth.password')"
          required
        >
        </v-text-field>

        <v-btn rounded outlined color="accent" @click="trySignin()">
          {{ $l("auth.btn.log_in") }}
        </v-btn>
      </v-form>
      <br />
      <!-- <v-alert
        v-if="errorMessage != ''"
        dense
        outlined
        text
        border="left"
        type="warning"
      >
        {{ errorMessage }}
      </v-alert> -->
      <!-- <v-snackbar
        max-width="800"
        color="error"
        timeout="15000"
        v-model="showSnackbar"
      >
        <p class="errorSnackbar ma-0" v-html="$l('auth.allow_cookies')"></p>
      </v-snackbar> -->
      <p>{{ $l("auth.forgot") }}</p>
      <p @click="goTo('Register')">{{ $l("auth.account_yet") }}</p>
    </v-card>
  </div>
</template>

<script>
//import { mapActions } from "vuex";
import Subheader from "@/components/app/Subheader.vue";
// import { GoogleAuthService } from "@/services/index";
import { goTo } from "@/plugins/GlobalMethods.js";

export default {
  permisions: {
    roles: "ALL",
  },
  data() {
    return {
      valid: true,
      email: "",
      emailRules: [
        (v) => !!v || this.$l("auth.rules.email.require"),
        (v) => (v || "").indexOf(" ") < 0 || this.$l("auth.rules.no_spaces"),
        (v) => /.+@.+\..+/.test(v) || this.$l("auth.rules.email.valid"),
      ],
      password: "",
      showPassword: false,
      passwordLength: 40,
      passwordMinLength: 6,
      passwordRules: [
        (v) => !!v || this.$l("auth.rules.password.require"),
        (v) => (v || "").indexOf(" ") < 0 || this.$l("auth.rules.no_spaces"),
        (v) =>
          (v && v.length >= this.passwordMinLength) ||
          this.$l("auth.rules.password.length.min", {
            n: this.passwordMinLength,
          }),
        (v) =>
          (v && v.length <= this.passwordLength) ||
          this.$l("auth.rules.password.length.max", { n: this.passwordLength }),
      ],
      // errorMessage: "",
      // showSnackbar: false,
    };
  },
  mounted() {
    // GoogleAuthService.currentUser();
    addEventListener("keypress", this.keyPressed);
  },
  beforeDestroy() {
    removeEventListener("keypress", this.keyPressed);
  },
  methods: {
    goTo,
    // logIn() {
    //   GoogleAuthService.signIn().catch((e) => {
    //     if (e.error === "idpiframe_initialization_failed") {
    //       this.showSnackbar = true;
    //     }
    //   });
    // },
    // logOut() {
    //   GoogleAuthService.signOut();
    // },
    keyPressed(e) {
      if (e.key === "Enter") this.trySignin();
    },
    trySignin() {
      if (this.$refs.form.validate())
        this.$store
          .dispatch("auth/signin", {
            form: {
              email: this.email,
              password: this.password,
            },
          })
          .then((val) => (this.errorMessage = val));
    },
  },
  components: {
    Subheader,
  },
};
</script>

<style scoped lang="scss">
@import "@/scss/mixins.scss";

::v-deep .v-snack__wrapper {
  border-radius: 15px !important;
}

#container {
  overflow: auto;
}
#card {
  height: fit-content;
  padding: 30px;
  width: min(90%, 400px);
  margin: calc(106px + 3rem) auto 3rem auto;
  border-radius: 15px;
  @include box-shadow;
  ::v-deep {
    .v-messages__message {
      font-size: 12px !important;
    }
  }
}

#google .v-icon {
  margin-right: 10px;
}

p:not(.errorSnackbar) {
  color: var(--v-secondary-darken2);
  font-size: 87.5%;
  cursor: pointer;
  &:hover {
    color: var(--v-secondary-darken3);
  }

  margin: 1rem 0 0 0;
}
</style>

