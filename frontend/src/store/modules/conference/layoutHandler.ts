import {
  BarElements,
  ColumnElemnts,
  IsBarOpen,
  IsTogledTop,
  SetBarEl,
  SetBarState,
  SetColumnEl,
} from "@/components/conference/types";
import store from "@/store";

import ToggleStore from "@/store/modules/conference/toggleStore";
import {
  Module,
  VuexModule,
  Action,
  Mutation,
  getModule,
} from "vuex-module-decorators";

@Module({
  name: "conferenceLayoutHandler",
  namespaced: true,
  dynamic: true,
  store,
})
class ConferenceLayoutHandler extends VuexModule {
  public columns: ColumnElemnts = { left: null, center: null, right: null };
  public centerColumnPos: -1 | 0 | 1 = 0;

  public bars: BarElements = { top: null, bottom: null };
  public isBarOpen: IsBarOpen = { top: false, bottom: false };

  @Action
  async toggle({ isLeft }: { isLeft: boolean }) {
    this.closeOppositePanel({ isLeft });

    await new Promise((r) => setTimeout(() => r(""), 0));

    const sum: number | void = await this.getSumWidth();

    if (!sum) return;

    if (sum > window.innerWidth) {
      if (isLeft) this.setCenterColumnPos(1);
      else this.setCenterColumnPos(-1);
    } else this.setCenterColumnPos(0);
  }
  @Action
  closeOppositePanel({ isLeft }: { isLeft: boolean }) {
    const name: string = isLeft ? "chat" : "settings";
    ToggleStore.setToggle({ side: "top", name, val: false });
  }
  @Action
  async getSumWidth(): Promise<number | void> {
    if (!this.columns.left || !this.columns.center || !this.columns.right)
      throw new Error("One of three elements is not defined");

    const isToggledTop: IsTogledTop = ToggleStore.isToggled.top;

    let sum: number = this.columns.center.clientWidth;
    if (isToggledTop.settings) sum += this.columns.left.clientWidth;
    if (isToggledTop.chat) sum += this.columns.right.clientWidth;

    return sum;
  }

  @Mutation
  setColumnEl({ name, el }: SetColumnEl) {
    this.columns[name] = el;
  }
  @Mutation
  setCenterColumnPos(val: -1 | 0 | 1) {
    this.centerColumnPos = val;
  }

  @Mutation
  setBarState({ isTop, val }: SetBarState) {
    const name: string = isTop ? "top" : "bottom";
    this.isBarOpen[name] = val;
  }
  @Mutation
  setbarEl({ isTop, el }: SetBarEl) {
    const name = isTop ? "top" : "bottom";
    this.bars[name] = el;
  }
}

export default getModule(ConferenceLayoutHandler);
