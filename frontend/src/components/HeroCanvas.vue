<template>
  <canvas ref="canvas" />
</template>

<script>
import { rndBtw } from "@/plugins/GlobalMethods.js";
import Char from "@/classes/heroCanvas/Char.js";

export default {
  data() {
    return {
      chars: {
        perNPxs: 15000, //
        arr: [],
        val: [
          "0",
          "1",
          "2",
          "3",
          "∞",
          "a",
          "b",
          "c",
          "+",
          "-",
          "≈",
          "√",
          "∫",
          "%",
          "≥",
          "α",
          "β",
          "x",
          "y",
          "π",
        ],
        font: "Comfortaa",
        dFontSize: { min: 20, max: 45 },
        fontColor: [
          "#dfdfdf",
          "#d8d8d8",
          "#cfcfcf",
          "#c8c8c8",
          "#bfbfbf",
          "#b8b8b8",
          "#afafaf",
        ],
      },
      canvasColor: "#efefef",
      sensitivityMultipleByFont: 0.01,
      fadeInProcess: false,
      concentrationOfSmallChars: 0.5,
    };
  },
  props: ["fadeTimeout"],
  mounted() {
    addEventListener("resize", this.resize);
    document.addEventListener("mousemove", this.mousemove);

    this.setUpContext();

    this.setUpVariables();

    setTimeout(() => {
      this.generateChars();

      this.animate();
    }, 0);
  },
  beforeDestroy() {
    removeEventListener("resize", this.resize);
    document.removeEventListener("mousemove", this.mousemove);
  },
  methods: {
    setUpContext() {
      this.canvas = this.$refs.canvas;

      this.ctx = this.canvas.getContext("2d");

      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;

      this.fillBackground();
    },
    setUpVariables() {
      this.mouseX = this.canvas.width / 2;
      this.mouseY = this.canvas.height / 2;

      this.getCharsNumber();
    },
    getCharsNumber() {
      this.chars.number =
        (this.canvas.width * this.canvas.height) / this.chars.perNPxs;
    },
    fillBackground() {
      this.ctx.fillStyle = this.canvasColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    },

    generateChars() {
      for (var i = 0; i < this.chars.number; i++) {
        var val = this.chars.val[this.rndBtw(0, this.chars.val.length - 1)];

        var x = this.rndBtw(0, this.canvas.width);
        var y = this.rndBtw(0, this.canvas.height);

        var d = this.chars.dFontSize;
        var fontSize =
          d.min +
          1 +
          1 /
            (this.rndBtw(
              (1 / (d.max - d.min)) * 1000,
              this.concentrationOfSmallChars * 1000
            ) /
              1000);

        var sizeRatio =
          (fontSize - this.chars.dFontSize.min) /
          (this.chars.dFontSize.max - this.chars.dFontSize.min);
        if (sizeRatio === 0);
        var colorNum =
          Math.ceil(sizeRatio / (1 / this.chars.fontColor.length)) - 1;
        var color = this.chars.fontColor[colorNum];

        var opacity10 = this.rndBtw(0, 255);

        this.chars.arr.push(
          new Char(
            this.ctx,
            val,
            x,
            y,
            fontSize,
            color,
            this.chars.font,
            opacity10
          )
        );
      }

      this.chars.arr.sort((a, b) => a.fontSize - b.fontSize);
    },

    animate() {
      requestAnimationFrame(this.animate);

      setTimeout(() => {
        if (this.fadeInProcess == false) {
          this.fillBackground();
          this.updateMouseForChars();
          this.chars.arr.forEach((char) => {
            char.update();
          });
        }
      }, 0);
    },
    resize() {
      this.canvas.width = innerWidth;
      this.canvas.height = innerHeight;

      this.chars.arr = [];

      this.getCharsNumber();

      this.generateChars();

      this.updateMouseForChars();

      this.fillBackground();
    },
    mousemove(e) {
      this.mouseX = e.x;
      this.mouseY = e.y;
      if (!this.fadeInProcess) this.updateMouseForChars();
    },
    updateMouseForChars() {
      this.chars.arr.forEach((val) => {
        val.x =
          val.baseX +
          this.sensitivityMultipleByFont *
            (val.fontSize - this.chars.dFontSize.min) *
            (this.mouseX - this.canvas.width / 2);
        val.y =
          val.baseY +
          this.sensitivityMultipleByFont *
            (val.fontSize - this.chars.dFontSize.min) *
            (this.mouseY - this.canvas.height / 2);
      });
    },

    mouseEnter() {
      this.fadeInProcess = true;

      setTimeout(() => {
        this.fadeInProcess = false;
      }, this.fadeTimeout);
    },
    rndBtw,
  },
};
</script>

<style lang="scss" scoped>
canvas {
  position: absolute;
  background: var(--v-background-base);
  z-index: -1;
}
</style>
