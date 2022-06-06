export interface SwipeEventCallback {
  (move: { x: number; y: number }, status: "start" | "move" | "end"): void;
}

export interface SwipedEventCallback {
  (direction: Direction): void;
}

export interface Vector {
  x: number;
  y: number;
}

export interface PromiseRes<T = unknown> {
  (value: T): void;
}

export type Direction = "right" | "left" | "up" | "down" | null;
