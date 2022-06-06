import { apiRequest } from "@/services/api.service.js";
import router from "@/router";
import axios from "axios";

export default {
  namespaced: true,
  state() {
    return {
      state: "idle",
      lessons: [],
      offeredLessons: [],
      zoomLink:
        "https://us04web.zoom.us/j/5839697402?pwd=T01CeDdOMGZHZVplOGdzK2ZieGpZdz09",
    };
  },

  mutations: {
    mutate(state, { name, val }) {
      state[name] = val;
    },
    addOfferedLesson(state, { lesson }) {
      state.offeredLessons.push(lesson);
    },
    deleteOfferedLesson(state, { lessonId, offerLogId }) {
      if (!lessonId && !offerLogId) return;
      state.offeredLessons = state.offeredLessons.filter(
        (lesson) =>
          (!lessonId || lesson.lessonId != lessonId) &&
          (!offerLogId || lesson.offerLogId != offerLogId)
      );
    },
  },

  actions: {
    async getLessons(context, { vm }) {
      context.commit("mutate", { name: "state", val: "listening" });
      context.commit("mutate", { name: "vm", val: vm });
      loop(context);
    },
    async sendOffer(context, { lesson }) {
      const lessonCopy = getLessonCopy(lesson);
      const res = await sendOffer(context, { logId: lesson.logId });
      if (!exitIfUndefined(context, { data: res, alertName: "send" }))
        return null;
      addOfferedLesson({ lessonCopy, res });
      return res.data.logId;

      function getLessonCopy(lesson) {
        const info = context.state.lessons.find(
          (el) => el.lessonId == lesson.lessonId
        );
        return JSON.parse(JSON.stringify(info));
      }
      function addOfferedLesson({ lessonCopy, res }) {
        context.commit("addOfferedLesson", {
          lesson: {
            details: lessonCopy.details,
            lessonLogId: lesson.logId,
            lessonId: lesson.lessonId,
            offerLogId: res.data.logId,
            studentUUID: lessonCopy.studentUUID,
          },
        });
      }
    },
    async cancelOffer(context, { offerLogId }) {
      const r = await cancelOffer(context, { offerLogId });
      if (r) context.commit("deleteOfferedLesson", { offerLogId });
      else alert(context.state.vm.$l("choose_a.student.fail.cancel"));
    },
  },
};

async function loop(context) {
  switch (context.state.state) {
    case "listening":
      await getLessons(context);
      await listenForAccepted(context);
      break;
    case "idle":
    default:
      return;
  }
  await new Promise((r) => setTimeout(r, 1000));
  loop(context);
}

async function getLessons(context) {
  return await apiRequest({
    method: "get",
    urlEnd: "/lessons/open",
  })
    .then((r) =>
      !exitIfUndefined(context, { data: r, alertName: "lessons" }) ? null : r
    )
    .then((r) => r.data.lessons.map((lesson) => normalize(lesson)))
    .then(async (lessons) => await getStudentInfo(lessons))
    .then((lsns) => context.commit("mutate", { name: "lessons", val: lsns }));

  function normalize(lesson) {
    lesson.details = JSON.parse(lesson.details.replace("/", ""));
    return lesson;
  }
  async function getStudentInfo(lessons) {
    return await axios.all(
      lessons.map(
        (lesson) => addStudentInfo(lesson)
        // cancelOffer({ state }, { offerLogId: offer.offerLogId })
      )
    );
    async function addStudentInfo(lesson) {
      return await requestInfo(lesson);
    }
    async function requestInfo(lesson) {
      const res = await apiRequest({
        method: "get",
        urlEnd: `/account/${lesson.studentUUID}/student`,
      });

      for (const key in res.data) lesson.details[key] = res.data[key];
      return lesson;
    }
  }
}

async function sendOffer(context, { logId }) {
  return await apiRequest({
    method: "post",
    urlEnd: "/lessons/logs/" + logId + "/offer",
  });
}

async function listenForAccepted(context) {
  const logArr = await getLogArr(context);
  if (!exitIfUndefined(context, { data: logArr, alertName: "listen_accept" }))
    return;
  logArr.forEach((log) => deleteIfUndefined(context, { log }));
  const acceptedLog = getAcceptedLog(logArr);
  if (!acceptedLog) return;
  context.commit("mutate", { name: "state", val: "accepted" });
  const acceptedLogId = getAcceptedLogId(acceptedLog);
  cancelOtherLessons(context, { lessonId: acceptedLog.data.lessonId });
  const initRes = await initConference(context, { acceptedLogId });
  if (!backToListeningIfUndefined(context, { initRes })) return;
  openConference(context);

  async function getLogArr(context) {
    return await axios
      .all(context.state.offeredLessons.map((ids) => request(context, { ids })))
      .then((r) => r.filter((res) => res != undefined));

    async function request(context, { ids }) {
      return await apiRequest({
        method: "get",
        urlEnd: "/lessons/logs/" + ids.offerLogId + "/accepted",
      }).then((r) => {
        if (r != undefined) return r;
        context.commit("deleteOfferedLesson", { offerLogId: ids.offerLogId });
      });
    }
  }
  function deleteIfUndefined({ state }, { log }) {
    if (!log || log?.statusText != "OK")
      cancelOffer({ state }, { offerLogId: log.damta.logId });
  }
  function getAcceptedLog(logArr) {
    return logArr.find((log) =>
      log.data.childLogs.some((childLog) => childLog.type === "ACCEPTED")
    );
  }
  function getAcceptedLogId(acceptedLog) {
    return acceptedLog.data.childLogs.find(
      (childLog) => childLog.type === "ACCEPTED"
    ).id;
  }
  async function initConference({ state }, { acceptedLogId }) {
    return await apiRequest({
      method: "post",
      urlEnd: "/lessons/logs/" + acceptedLogId + "/init",
      data: {
        zoomLink: state.zoomLink,
      },
    });
  }
  function backToListeningIfUndefined(context, { initRes }) {
    if (!initRes) {
      alert(context.state.vm.$l("choose_a.student.fail.conference"));
      context.commit("mutate", { name: "state", val: "listening" });
    }
    return initRes;
  }
  function cancelOtherLessons(context, { lessonId }) {
    context.commit("deleteOfferedLesson", { lessonId });
    context.state.offeredLessons.forEach((lesson) => {
      context.dispatch("cancelOffer", { offerLogId: lesson.offerLogId });
    });
  }
  function openConference(context) {
    context.commit("mutate", { name: "state", val: "conference" });
    window.open(context.state.zoomLink, "_self");
  }
}

async function cancelOffer(context, { offerLogId }) {
  return await apiRequest({
    method: "post",
    urlEnd: "/lessons/logs/" + offerLogId + "/close",
  });
}

// ---------------------------------

// temporary

// ---------------------------------

function exitIfUndefined(context, { data, alertName }) {
  if (!data) {
    alert(context.state.vm.$l(`choose_a.student.fail.${alertName}`));
    context.commit("mutate", { name: "state", val: "idle" });
    deleteAllOffers(context);

    router.go(-1);
  }
  return data;
  async function deleteAllOffers({ state }) {
    axios.all(
      state.offeredLessons.map((offer) =>
        cancelOffer({ state }, { offerLogId: offer.offerLogId })
      )
    );
  }
}
