import { apiRequest } from "@/services/api.service.js";
import store from "@/store/index";

export default {
  async signup(form) {
    return await apiRequest({
      method: "post",
      urlEnd: "/auth/signup",
      data: form,
      withJwt: false,
    }).catch((err) => handleErr(err));
  },
  async signin(form) {
    const res = await apiRequest({
      method: "post",
      urlEnd: "/auth/signin",
      data: form,
      withJwt: false,
    }).catch((err) => handleErr(err));
    trySetTokens(res);
    return res;

    function trySetTokens(res) {
      if (res.statusText == "OK") {
        localStorage.setItem("refreshToken", res.data.refreshToken);
        delete res.data.refreshToken;
        sessionStorage.setItem("user", JSON.stringify(res.data));
        store.dispatch("auth/updateUser", res.data);
      }
    }
  },
  async getUserDetails() {
    return await apiRequest({
      method: "get",
      urlEnd: "/account/me",
    });
  },
  async refreshJwt() {
    const refreshToken = localStorage.getItem("refreshToken");
    return await apiRequest({
      method: "post",
      urlEnd: "/auth/refreshToken",
      data: { refreshToken },
      withJwt: false,
    }).then((r) => tryUpdateInfo(r));

    function tryUpdateInfo(r) {
      if (r.statusText == "OK") {
        localStorage.setItem("refreshToken", r.data.refreshToken);
        const user = JSON.parse(sessionStorage.getItem("user"));
        user.jwt = r.data.jwt;
        store.dispatch("auth/updateUser", user);
      }
      return r;
    }
  },
  // logout() {
  //   localStorage.removeItem("user");
  // },
  // isAuth() {
  //   let user = JSON.parse(localStorage.getItem("user"));
  //   return Boolean(user && user.accessToken);
  // },
};

function handleErr(err) {
  console.error(err.response.data);
  console.log("ERROR");
  return err;
}

