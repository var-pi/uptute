import store from "@/store";
import { constraints } from "@/constants/peer-connection";

import Main from "@/store/modules/conference/main";
import ToggleStore from "@/store/modules/conference/toggleStore";
import { Module, VuexModule, Action, getModule } from "vuex-module-decorators";

@Module({ name: "screenShare", namespaced: true, dynamic: true, store })
class ConferenceScreenShare extends VuexModule {
  @Action
  toggle(isToggled: boolean): void {
    const self = this;

    if (!isToggled) share();
    else Main.stopTrack({ isLocal: true, isVideo: true });

    async function share(): Promise<void> {
      const track: MediaStreamTrack | Error = await navigator.mediaDevices
        .getDisplayMedia()
        .then((stream) => stream.getVideoTracks()[0]);

      if (track instanceof Error) return console.error(track.message);

      track.onended = self.stopScreenSharing;
      Main.replaceLocalTrack({ isVideo: true, newTrack: track });
      ToggleStore.setToggle({ side: "bottom", name: "screenShare", val: true });
    }
  }
  @Action
  async stopScreenSharing(): Promise<void> {
    const media = await navigator.mediaDevices.getUserMedia(constraints);
    const newTrack: MediaStreamTrack = media.getVideoTracks()[0];
    Main.replaceLocalTrack({ isVideo: true, newTrack });
    ToggleStore.setToggle({ side: "bottom", name: "screenShare", val: false });
    console.log("Stoped sharing the screen");
  }
}

export default getModule(ConferenceScreenShare);
