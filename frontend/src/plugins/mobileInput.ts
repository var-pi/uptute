import {
  Direction,
  PromiseRes,
  SwipedEventCallback,
  SwipeEventCallback,
  Vector,
} from "@/types";
import { VueConstructor } from "vue";

export default {
  install(Vue: VueConstructor<Vue>) {
    Vue.prototype.$mb = new Vue();

    const listeners = [
      addSwipeListener,
      removeSwipeListener,

      addSwipedListener,
      removeSwipedListener,

      isMobileInput,
    ];

    for (const listener of listeners)
      Vue.prototype.$mb[listener.name] = listener;
  },
};

function addSwipeListener(callback: SwipeEventCallback, el = document) {
  const pos: Vector = { x: 0, y: 0 };
  const move: Vector = { x: 0, y: 0 };

  const touchstart = (e: TouchEvent): void => {
    pos.x = e.touches[0].clientX;
    pos.y = e.touches[0].clientY;
    move.x = 0;
    move.y = 0;
    callback(move, "start");
  };

  const touchmove = (e: TouchEvent): void => {
    move.x = pos.x - e.touches[0].clientX;
    move.y = pos.y - e.touches[0].clientY;
    callback(move, "move");
  };

  const touchend = (): void => {
    callback(move, "end");
  };

  const removeListeners = (e: Event): void => {
    const detail: SwipeEventCallback = (e as CustomEvent).detail;
    if (callback != detail) return removeError();
    el.removeEventListener("touchstart", touchstart);
    el.removeEventListener("touchmove", touchmove);
    el.removeEventListener("touchend", touchend);
  };

  el.addEventListener("touchstart", touchstart);
  el.addEventListener("touchmove", touchmove);
  el.addEventListener("touchend", touchend);
  el.addEventListener("removeSwipeListener", removeListeners, { once: true });
}
function removeSwipeListener(callback: SwipeEventCallback, el = document) {
  const e = { detail: callback };
  el.dispatchEvent(new CustomEvent("removeSwipeListener", e));
}

function addSwipedListener(callback: SwipedEventCallback, el = document) {
  const delay = 200; // ms
  const minMagnitude = 100; // px

  const swipe = (e: TouchEvent) => {
    const touchmove = (e: TouchEvent) => {
      move.x = pos.x - e.touches[0].clientX;
      move.y = pos.y - e.touches[0].clientY;
    };

    const calcMove = (res: PromiseRes<Vector>): void => {
      el.addEventListener("touchmove", touchmove, { passive: true });
      el.addEventListener("touchend", () => res(move), { once: true });
      setTimeout(() => res({ x: 0, y: 0 }), delay);
    };

    const getDirection = (move: Vector): Direction => {
      const magnitude: number = Math.sqrt(move.x * move.x + move.y * move.y);
      const isHorisontal: boolean = Math.abs(move.x) > Math.abs(move.y);

      if (magnitude < minMagnitude) return null;
      if (isHorisontal) return move.x > 0 ? "right" : "left";
      else return move.y > 0 ? "up" : "down";
    };

    const pos: Vector = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    const move: Vector = { x: 0, y: 0 };

    new Promise(calcMove).then((move) => {
      el.removeEventListener("touchmove", touchmove);
      callback(getDirection(move));
    });
  };

  const removeListener = (e: Event) => {
    const detail: SwipedEventCallback = (e as CustomEvent).detail;
    if (callback !== detail) return removeError();
    el.removeEventListener("touchstart", swipe);
  };

  el.addEventListener("touchstart", swipe, { passive: true });
  el.addEventListener("removeSwipedListener", removeListener);
}
function removeSwipedListener(callback: SwipedEventCallback, el = document) {
  const e = { detail: callback };
  el.dispatchEvent(new CustomEvent("removeSwipedListener", e));
}

function isMobileInput() {
  return window.matchMedia("(pointer: coarse)").matches;
}

// ! --- Helper Functions ---------------------------------------------------

function removeError() {
  throw new Error("Failed to remove a listener. No listener has this callback");
}

