import { SwipeEventCallback, SwipedEventCallback } from "@/types";

export default interface mobileInput {
  /**
   * Triggers a callback on swipe
   *
   * @param {SwipeEventCallback} callback - `(move, state): void`
   * @param {{ x: number; y: number }} move - { x: number; y: number }
   * @param {"start" | "move" | "end"} status - "start" | "move" | "end"
   */
  addSwipeListener: (callback: SwipeEventCallback, el?: Element) => void;
  removeSwipeListener: (callback: SwipeEventCallback, el?: Element) => void;

  /**
   * Triggers a callback after touchend event or after certain delay.
   *
   * @param {SwipedEventCallback} callback - `(direction): void`
   * @param {"right" | "left" | "up" | "down" | null} direction - "right" | "left" | "up" | "down" | null
   */
  addSwipedListener: (callback: SwipedEventCallback, el?: Element) => void;
  removeSwipedListener: (callback: SwipedEventCallback, el?: Element) => void;

  isMobileInput: () => boolean;
}
