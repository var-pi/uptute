import {
  PeerConnectionConfig,
  RTCDataChannelOverride,
} from "@/components/conference/types";

export const config: PeerConnectionConfig = {
  iceServers: [
    {
      // urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
      urls: ["stun:stun.l.google.com:19302"],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const constraints: DisplayMediaStreamConstraints = {
  video: true,
  audio: true,
};

export const dataChannelOptions: RTCDataChannelOverride = {
  ordered: true,
};
