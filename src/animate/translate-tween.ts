import {Easing, Tween} from "./types";
import {GpNodeView} from "../types";
import Easings from "./easings";
import now from "../Utils/now";

export default class TranslateTween implements Tween {
  private endTime: number;
  private startTime: number;
  private easing: Easing;

  constructor(
    protected view: GpNodeView,
    private duration: number,
    private x1: number,
    private y1: number,
    private x2: number,
    private y2: number,
    easing?: Easing
  ) {
    this.easing = easing || Easings.easeOutCirc;
    this.startTime = now();
    this.endTime = this.startTime + duration; //(((this.x1 === x2 || Math.abs(x2 - this.x1) <= 0.001) && ((this.y1 === y2 || Math.abs(this.y1 - y2) <= 0.001)) ) ? 0 : duration);
  }

  execute(time: number) : boolean {

    if (time >= this.endTime) {
      //this.view.setPosition(this.x2, this.y2);
      return true;
    } else {
      //this.view.setPosition(
        this.easing(time - this.startTime, this.x1, this.x2 - this.x1, this.duration);
        this.easing(time - this.startTime, this.y1, this.y2 - this.y1, this.duration);
//      );
      return false;
    }
  }

  matches(tween: TranslateTween) {
    return this.execute === tween.execute && this.view === tween.view;
  }
}

