// import router from "@/router";
import account from "../../services/account.service";
import store from "@/store/index";
// import l from "@/services/locale.service.js";
// import { vm } from "@/main";

export default {
  namespaced: true,
  state: {},
  actions: {
    async getUserDetails() {
      return await account.getUserDetails();
    },
    async updateUserDetails(ctx, { data }) {
      return await account.updateUserDetails({ data });
    },
    async upgradeToUser(ctx, { data }) {
      return await account
        .upgradeToUser({ data })
        .then((r) => tryUpdateUser(r));
    },
    async upgradeToTutor(ctx, { data }) {
      return await account
        .upgradeToTutor({ data })
        .then((r) => tryUpdateUser(r));
    },
    async upgradeToStudent(ctx, { data }) {
      return await account
        .upgradeToStudent({ data })
        .then((r) => tryUpdateUser(r));
    },
  },
  mutations: {
    mutate(state, { name, val }) {
      state[name] = val;
    },
  },
};

function tryUpdateUser(r) {
  if (r.statusText == "OK") {
    let user = JSON.parse(sessionStorage.getItem("user"));
    user.jwt = r.data.jwt;
    user.roles = r.data.roles;
    store.dispatch("auth/updateUser", user);
  }
  return r;
}
