<template>
  <video
    ref="videoRef"
    :srcObject.prop="stream"
    :muted="muted"
    :class="{ exists: ratio != 0 }"
    :style="`
    --w: ${rect.w}px; 
    --h: ${rect.h}px;
    --margin: ${margin}px;
    `"
    playsinline
    autoplay
  />
</template>

<script lang="ts">
import ConferenceVideos from "@/components/conference/centerColumn/video/Videos.vue";

import Main from "@/store/modules/conference/main";
import { Axis, Rect } from "@/components/conference/types";
import {
  Vue,
  Component,
  Prop,
  Watch,
  Ref,
  InjectReactive,
  Inject,
} from "vue-property-decorator";

@Component
export default class VideoBase extends Vue {
  @InjectReactive() readonly videosInstance!: ConferenceVideos;
  @Inject() readonly margin!: number;

  @Prop({ type: Boolean, default: false }) readonly muted!: boolean;
  @Prop(Boolean) readonly isLocal!: boolean;

  get stream(): MediaStream {
    return this.isLocal ? Main.streams.local : Main.streams.remote;
  }

  @Ref() readonly videoRef!: HTMLVideoElement;

  public ratio: number = 0; // for HTML
  public rect: Rect = { w: 0, h: 0 }; // for HTML

  mounted(): void {
    this.videoRef.addEventListener("loadedmetadata", this.onMetadata);
  }
  beforeDestroy(): void {
    this.videoRef.removeEventListener("loadedmetadata", this.onMetadata);
  }

  private onMetadata(): void {
    const self = this;

    this.ratio = getRatio();
    emitRatio(this.ratio);

    function getRatio() {
      return self.videoRef.videoWidth / self.videoRef.videoHeight;
    }
    function emitRatio(ratio: number) {
      const isLocal = self.isLocal;
      self.videosInstance.$emit("gotRatio", { isLocal, ratio });
    }
  }

  calcRect(): void {
    const self = this;

    let rect: Rect = { w: 0, h: 0 };

    rect = getFromAxis(rect);
    rect = checkOutOfBounds(rect);

    this.rect = rect;

    function getFromAxis(rect: Rect): Rect {
      const r: number = self.ratio;
      const a: Axis = self.videosInstance.axis;
      let w: number = rect.w;
      let h: number = rect.h;

      if (a.x != 0) {
        w = a.x;
        h = w / r;
      } else if (a.y != 0) {
        h = a.y;
        w = r * h;
      }

      return { w, h };
    }
    function checkOutOfBounds(rect: Rect): Rect {
      const r: number = self.ratio;
      const m: number = 2 * self.margin;
      const maxW: number = self.videosInstance.rect.w;
      const maxH: number = self.videosInstance.rect.h;

      let w: number = rect.w;
      let h: number = rect.h;

      if (w > maxW) {
        w = maxW - m;
        h = w / r;
      } else if (h > maxH) {
        h = maxH - m;
        w = h * r;
      }

      return { w, h };
    }
  }

  private get axis() {
    return this.videosInstance.axis;
  }
  @Watch("axis", { deep: true })
  onAxisChange = (): void => this.calcRect();
}
</script>

<style lang="scss" scoped>
@import "@/scss/styles.scss";

video {
  border-radius: 15px;
  &.exists {
    margin: var(--margin);
    width: var(--w);
    height: var(--h);
  }
  &:not(.exists) {
    @include box-size(0px);
  }

  transition: transform 300ms;
  &:hover {
    cursor: pointer;
    transform: scale(0.99);
  }
}
</style>
