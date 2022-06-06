export const config = {
  iceServers: [
    {
      // urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const constraints = {
  video: true,
  audio: true,
};

export const dataChannelOptions = {
  ordered: true,
};
