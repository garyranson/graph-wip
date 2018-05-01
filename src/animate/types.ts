export type Easing =   (t: number, b: number, c: number, d: number) => number;
export type TweenExecute = (time: number) => boolean;

export interface Tween {
  execute: TweenExecute;
  matches(tween: Tween): boolean;
}
