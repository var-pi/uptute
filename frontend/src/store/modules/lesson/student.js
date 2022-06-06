import { apiRequest, isJwtExpired } from "@/services/api.service.js";
import router from "@/router";
import axios from "axios";

export default {
  namespaced: true,
  state() {
    return {
      state: "idle",
      info: {},
      lessonId: "",
      logId: "",
      tutors: [],
      vm: null,
    };
  },
  mutations: {
    mutate(state, { name, val }) {
      state[name] = val;
    },
  },
  actions: {
    async request(context, { info, vm }) {
      context.commit("mutate", { name: "state", val: "initializing" });
      context.commit("mutate", { name: "vm", val: vm });
      info.tutors = [];
      context.commit("mutate", { name: "info", val: info });

      const bool = await initialize(context);
      if (!bool) return false;
      loop(context);
      return true;
    },
    async rejectOffer(context, { offerLogId }) {
      const res = await rejectOffer(context, { offerLogId });
      const bool = res && res.statusText === "OK";
      if (!bool) alert(context.state.vm.$l("choose_a.tutor.fail.reject"));
      return bool;
    },
    async accept(context, { offerLogId }) {
      const res = await accept(context, { offerLogId });
      if (!res) {
        alert(context.state.vm.$l("choose_a.tutor.fail.accept"));
        return;
      }
      context.commit("mutate", { name: "acceptedLogId", val: res.data.logId });
      context.commit("mutate", { name: "state", val: "accepted" });
    },
    async deleteLesson(context) {
      context.commit("mutate", { name: "state", val: "idle" });
      return await deleteLesson(context);
    },
  },
};

async function loop(context) {
  switch (context.state.state) {
    case "listening":
      await getOffers(context);
      break;
    case "accepted":
      await listenForInit(context);
      break;
    case "idle":
    default:
      return;
  }
  await new Promise((r) => setTimeout(r, 1000));
  loop(context);
}

async function initialize(context) {
  let data = await postData(context);
  if (!exitIfUndefined(context, { data, alertName: "init" })) return false;

  context.commit("mutate", { name: "lessonId", val: data.lessonId });
  context.commit("mutate", { name: "logId", val: data.logId });
  context.commit("mutate", { name: "state", val: "listening" });

  return true;

  async function postData({ state }) {
    let data = state.info;
    return await apiRequest({
      method: "post",
      urlEnd: "/lessons/create",
      data,
    }).then((r) => r?.data);
  }
}

async function getOffers(context) {
  const offerLogs = await getOfferLogs(context);
  if (!exitIfUndefined(context, { data: offerLogs, alertName: "offers" }))
    return;
  const tutors = await getTutorsDetails({ offerLogs });
  // handle undefined values of tutor
  console.log(tutors);
  context.commit("mutate", { name: "tutors", val: tutors });

  async function getOfferLogs({ state }) {
    return await apiRequest({
      method: "get",
      urlEnd: "/lessons/logs/" + state.logId + "/offer",
    }).then((r) => r.data?.childLogs?.map((obj) => obj));
  }
  async function getTutorsDetails({ offerLogs }) {
    return await axios.all(offerLogs.map((offerLog) => getObj(offerLog)));
    // here should be axios.all request for tutor info
    async function getObj(offerLog) {
      const details = await requestDetails(offerLog.createdBy)
        .then((r) => r.data)
        .then((r) => hardcodeDetails(r));
      return { details, offerLog: offerLog.id };
      async function requestDetails(tutorUUID) {
        return await apiRequest({
          method: "get",
          urlEnd: `/account/${tutorUUID}/tutor`,
        });
      }
      function hardcodeDetails(details) {
        details.pph = 12;
        details.hours = 194;
        details.rating = 3.6;
        details.comments = 3;
        return details;
      }
    }
  }
}
async function rejectOffer(context, { offerLogId }) {
  return await apiRequest({
    method: "post",
    urlEnd: "/lessons/logs/" + offerLogId + "/close",
  });
}

async function deleteLesson({ state }) {
  console.log("delete");
  console.log(state.logId);
  return await apiRequest({
    method: "post",
    urlEnd: "/lessons/logs/" + state.logId + "/close",
  });
}

async function accept(context, { offerLogId }) {
  return await apiRequest({
    method: "post",
    urlEnd: "/lessons/logs/" + offerLogId + "/accept",
  });
}

async function listenForInit(context) {
  const getInitRes = await getRequest(context);
  if (!stopIfUndefined({ data: getInitRes })) return;
  const initLog = getInitLog(getInitRes);
  if (initLog) {
    context.commit("mutate", { name: "state", val: "conference" });
    window.open(getLink(initLog), "_self");
  }
  return;

  async function getRequest({ state }) {
    return await apiRequest({
      method: "get",
      urlEnd: "/lessons/logs/" + state.acceptedLogId + "/init",
    });
  }
  function stopIfUndefined({ data }) {
    if (!data) {
      alert(context.state.vm.$l("choose_a.tutor.fail.conference"));
      context.commit("mutate", { name: "state", val: "listening" });
    }
    return data;
  }
  function getInitLog(getInitRes) {
    return getInitRes.data?.childLogs.find(
      (childLog) => childLog.type === "INIT"
    );
  }
  function getLink(initLog) {
    return initLog.details;
  }
}

function exitIfUndefined(context, { data, alertName }) {
  const jwt = JSON.parse(sessionStorage.getItem("user")).jwt;
  if (isJwtExpired(jwt))
    context.commit("mutate", { name: "state", val: "idle" });
  else if (!data && context.state.logId != "") {
    alert(context.state.vm.$l(`choose_a.tutor.fail.${alertName}`));
    context.dispatch("deleteLesson");
    router.go(-1);
  }
  return data;
}
