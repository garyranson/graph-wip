export type Easing =   (t: number, b: number, c: number, d: number) => number;
export interface Tween {
  execute(delta: number, duration: number, easing: Easing) : void;
  init?():void;
  complete(): void;
  matches<T extends Tween>(t: T) : boolean;
}
