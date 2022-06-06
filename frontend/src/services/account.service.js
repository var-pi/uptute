import { apiRequest } from "@/services/api.service.js";

export default {
  async getUserDetails() {
    return await apiRequest({
      method: "get",
      urlEnd: "/account/me",
    });
  },
  async updateUserDetails({ data }) {
    console.log(data);
    return await apiRequest({
      method: "patch",
      urlEnd: "/account/me",
      data,
    });
  },
  async upgradeToUser({ data }) {
    return await apiRequest({
      method: "post",
      urlEnd: "/account/me/user",
      data,
    });
  },
  async upgradeToStudent({ data }) {
    return await apiRequest({
      method: "post",
      urlEnd: "/account/me/student",
      data,
    });
  },
  async upgradeToTutor({ data }) {
    return await apiRequest({
      method: "post",
      urlEnd: "/account/me/tutor",
      data,
    });
  },
};
