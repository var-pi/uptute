<template>
  <div id="wrapper" :style="`--w: ${rect.w}px; --h: ${rect.h}px;`">
    <div id="videos" :class="{ flexRow: isFlexRow }">
      <LocalVideo ref="local" />
      <RemoteVideo ref="remote" />
    </div>
  </div>
</template>

<script lang="ts">
import LocalVideo from "@/components/conference/centerColumn/video/LocalVideo.vue";
import RemoteVideo from "@/components/conference/centerColumn/video/RemoteVideo.vue";

import {
  Rect,
  Axis,
  RatioEvent,
  RectTransitionIds,
  Ratios,
  SumRatios,
  BarElements,
  BarHeights,
  ColumnElemnts,
  IsTogledTop,
  IsBarOpen,
} from "@/components/conference/types";
import LayoutHandler from "@/store/modules/conference/layoutHandler";
import ToggleStore from "@/store/modules/conference/toggleStore";
import {
  Vue,
  Component,
  ProvideReactive,
  Watch,
  Inject,
} from "vue-property-decorator";

@Component({ components: { LocalVideo, RemoteVideo } })
export default class ConferenceVideos extends Vue {
  @Inject() readonly margin!: number;
  @Inject() readonly transitionTime!: number;

  private get isPanelToggled(): IsTogledTop {
    return ToggleStore.isToggled.top;
  }
  private get isBarOpen(): IsBarOpen {
    return LayoutHandler.isBarOpen;
  }

  private transitionIds: RectTransitionIds = { w: -1, h: -1 };
  private ratios: Ratios = { local: 0, remote: 0 };

  public isFlexRow: boolean = true; // for HTML
  public rect: Rect = { w: window.innerWidth, h: window.innerHeight };
  public axis: Axis = { x: 0, y: 0 };

  @ProvideReactive()
  get videosInstance(): ConferenceVideos {
    return this;
  }

  mounted(): void {
    this.$on("gotRatio", this.onGotRatio);
    addEventListener("resize", this.onResize);
  }
  beforeDestroy(): void {
    this.$off("gotRatio", this.onGotRatio);
    removeEventListener("resize", this.onResize);
  }

  onGotRatio({ isLocal, ratio }: RatioEvent): void {
    const type: string = isLocal ? "local" : "remote";
    this.ratios[type] = ratio;
    this.recalc();
  }
  onResize(): void {
    this.resizeAxis({ isX: true });
    this.resizeAxis({ isX: false });
  }
  recalc(): void {
    const getIfRow = (sumRatios: SumRatios): boolean => {
      const getFraction = (sumRatioVar: number): number => {
        const containerRatio: number = this.rect.w / this.rect.h;
        return sumRatioVar < containerRatio
          ? sumRatioVar / containerRatio
          : containerRatio / sumRatioVar;
      };
      return getFraction(sumRatios.row) > getFraction(sumRatios.col);
    };
    function getSumRatios(ratios: Ratios): SumRatios {
      const l = ratios.local;
      const r = ratios.remote;
      const row: number = l + r;
      const col: number = r == 0 ? l : (l * r) / (l + r);

      return { row, col };
    }
    const getAxis = (): Axis => {
      const getIfXFilled = (): boolean => {
        const containerRatio: number = this.rect.w / this.rect.h;
        return sumRatio > containerRatio;
      };
      const getX = (): number => {
        const isOneInCol: boolean = this.ratios.remote == 0 || this.isFlexRow;
        const my: number = isOneInCol ? 2 * m : 4 * m;
        return ifXFilled ? 0 : sumRatio * (this.rect.h - my);
      };
      const getY = (): number => {
        const isOneInRow: boolean = this.ratios.remote == 0 || !this.isFlexRow;
        const mx: number = isOneInRow ? 2 * m : 4 * m;
        return ifXFilled ? (this.rect.w - mx) / sumRatio : 0;
      };

      const ifXFilled: boolean = getIfXFilled();
      const m: number = this.margin;
      return { x: getX(), y: getY() };
    };

    const sumRatios: SumRatios = getSumRatios(this.ratios);
    this.isFlexRow = getIfRow(sumRatios);

    const sumRatio = this.isFlexRow ? sumRatios.row : sumRatios.col;
    this.axis = getAxis();
  }
  async resizeAxis({ isX }: { isX: boolean }): Promise<void> {
    const getTargetW = (): number => {
      const pos: number = LayoutHandler.centerColumnPos;

      if (pos != 0) return this.rect.w;

      const columns: ColumnElemnts = LayoutHandler.columns;

      if (!columns.left || !columns.right)
        throw new Error("Panel element is null");

      const w: { l: number; r: number } = {
        l: columns.left.clientWidth,
        r: columns.right.clientWidth,
      };
      const isOpen: { l: boolean; r: boolean } = {
        l: this.isPanelToggled.settings,
        r: this.isPanelToggled.chat,
      };

      const sidepanelWidth = isOpen.l ? w.l : isOpen.r ? w.r : 0;

      return window.innerWidth - sidepanelWidth;
    };
    const getTargetH = (): number => {
      const bars: BarElements = LayoutHandler.bars;

      if (!bars.top || !bars.bottom) throw new Error("Bar is null");

      const heights: BarHeights = {
        t: bars.top.clientHeight,
        b: bars.bottom.clientHeight,
      };
      const isOpen: { t: boolean; b: boolean } = {
        t: this.isBarOpen.top,
        b: this.isBarOpen.bottom,
      };

      let h = window.innerHeight;
      if (isOpen.t) h -= heights.t;
      if (isOpen.b) h -= heights.b;

      return h;
    };
    const smoothAxisChange = (): void => {
      const getNewVal = () => {
        const dT: number = Date.now() - curTime;
        const d: number = (totalChange * dT) / this.transitionTime;
        return this.rect[alias] + d;
      };

      const newVal: number = getNewVal();

      const isOverflow = totalChange < 0 ? newVal < target : newVal > target;

      if (isOverflow) {
        this.rect[alias] = target;
        reassignTransitionId(-1);
      } else {
        this.rect[alias] = newVal;
        curTime = Date.now();
      }

      this.recalc();
    };
    const reassignTransitionId = (newId: number): void => {
      const curId = this.transitionIds[alias];
      if (curId > 0) clearInterval(curId);

      this.transitionIds[alias] = newId;
    };

    await new Promise((r) => setTimeout(() => r("")));

    const alias: string = isX ? "w" : "h";

    const target = isX ? getTargetW() : getTargetH();
    const totalChange = target - this.rect[alias];

    if (totalChange == 0) return;

    let curTime = Date.now();

    const id = setInterval(() => smoothAxisChange());
    reassignTransitionId(id);
  }

  @Watch("isPanelToggled", { deep: true })
  onPanelStateChange = () => this.resizeAxis({ isX: true });

  @Watch("isBarOpen", { deep: true })
  onBarStateChange = () => this.resizeAxis({ isX: false });
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

#wrapper {
  width: var(--w);
  height: var(--h);
  position: relative;
  #videos {
    position: absolute;
    @include box-size(100%);
    &.flexRow {
      @include flexbox(row);
    }
    &:not(.flexRow) {
      @include flexbox(column);
    }
  }
}
</style>
