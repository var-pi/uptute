import store from "@/store";

import {
  Module,
  VuexModule,
  getModule,
  Mutation,
} from "vuex-module-decorators";

import Main from "@/store/modules/conference/main";
import LayoutHandler from "@/store/modules/conference/layoutHandler";
import ScreenShare from "@/store/modules/conference/screenShare";
import {
  ButtonToggleEvent,
  IsToggled,
  SetToggle,
} from "@/components/conference/types";
@Module({ name: "toggleStore", namespaced: true, dynamic: true, store })
class ToggleStore extends VuexModule {
  isToggled: IsToggled = {
    top: {
      settings: false,
      chat: false,
    },
    bottom: {
      micOff: false,
      camOff: false,
      end: false,
      screenShare: false,
      whiteboard: false,
    },
  };

  @Mutation
  toggle({ side, name }: ButtonToggleEvent): void {
    const self = this;
    const cur: boolean = this.isToggled[side][name];

    switch (name) {
      case "screenShare":
        ScreenShare.toggle(cur);
        break;
      case "end":
        Main.closeRoom();
        break;
      case "settings":
        toggle({ side, name });
        LayoutHandler.toggle({ isLeft: true });
        break;
      case "chat":
        toggle({ side, name });
        LayoutHandler.toggle({ isLeft: false });
        break;
      default:
        toggle({ side, name });
        break;
    }
    function toggle({ side, name }: ButtonToggleEvent): void {
      self.isToggled[side][name] = !self.isToggled[side][name];
    }
  }
  @Mutation
  setToggle({ side, name, val }: SetToggle) {
    this.isToggled[side][name] = val;
  }
}

export default getModule(ToggleStore);
