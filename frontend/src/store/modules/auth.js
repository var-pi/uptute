import router from "@/router";
import auth from "../../services/auth.service";
import store from "@/store/index";
// import l from "@/services/locale.service.js";
import { vm } from "@/main";

export default {
  namespaced: true,
  state: {
    user: null,
  },
  getters: {
    roles(state) {
      pullUser(state);
      return state?.user?.roles || [];
    },
  },
  actions: {
    async signup(ctx, form) {
      var response = await auth.signup(form);
      if (response.statusText == "OK") {
        const r = await ctx.dispatch("signin", {
          form,
          routeName: "PrimarySettingUp",
        });
        if (r.statusText != "OK") router.push({ name: "LogIn" });
      } else alert(vm.$l("auth.error.email_exists"));

      return response;
    },
    async signin(ctx, { form, routeName = null }) {
      const res = await auth.signin(form);
      if (res.statusText == "OK") routerPush(routeName);
      else alert(vm.$l("auth.error.email_or_password")); //Change to something from locales
      return res;

      function routerPush(routeName) {
        const roles = store.state.auth.user?.roles || [];
        if (routeName) router.push({ name: routeName });
        else if (roles.includes("ROLE_TUTOR"))
          router.push({ name: "ChooseAStudent" });
        else router.push({ name: "FindATutor" });
      }
    },

    async getUserDetails() {
      return await auth.getUserDetails();
    },
    async refreshJwt() {
      return await auth.refreshJwt();
    },
    logout(ctx) {
      ctx.dispatch("updateUser", {});
      localStorage.removeItem("refreshToken");
      router.push({ name: "LogIn" });
    },
    async tryAddRole(ctx, { role }) {
      let user = JSON.parse(sessionStorage.getItem("user"));
      if (!user.roles.includes(role)) {
        user.roles.push(role);
        ctx.dispatch("updateUser", user);
        return true;
      }
      return false;
    },
    async updateUser(ctx, user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      ctx.commit("mutate", { name: "user", val: user });
    },
  },
  mutations: {
    mutate(state, { name, val }) {
      state[name] = val;
    },
  },
};

function pullUser(state) {
  if (!state.user) state.user = JSON.parse(sessionStorage.getItem("user"));
}

