import {Easing, Tween} from "./types";
import {Easings} from "./easings";
import {Widget} from "template/widget";
import {EdgeState, State, VertexState} from "core/types";

/*
const now = ((p) => {
  if (!p) {
    const nowOffset = Date.now();
    return () => Date.now() - nowOffset;
  }
  return p.now;
})(window.performance);
*/

//const now = window.performance.now;

export class TranslateTween implements Tween {
  private endTime: number;
  private startTime: number;
  private easing: Easing;
  private from: VertexState;
  private to: VertexState;

  constructor(
    protected widget: Widget,
    private duration: number,
    to: VertexState,
    easing?: Easing
  ) {
    this.from = {...widget.state} as VertexState;
    this.to = {...to};
    this.easing = easing || Easings.easeOutCirc;
    this.startTime = window.performance.now();
    this.endTime = this.startTime + duration; //(((this.x1 === x2 || Math.abs(x2 - this.x1) <= 0.001) && ((this.y1 === y2 || Math.abs(this.y1 - y2) <= 0.001)) ) ? 0 : duration);
  }

  execute(time: number): boolean {

    if (time >= this.endTime) {
      this.widget.refresh(this.to as State);
      return true;
    } else {
      this.widget.refresh(<VertexState>{
        ...this.from,
        x: Math.round(this.easing(time - this.startTime, this.from.x, this.to.x - this.from.x, this.duration)),
        y: Math.round(this.easing(time - this.startTime, this.from.y, this.to.y - this.from.y, this.duration)),
        width: Math.round(this.easing(time - this.startTime, this.from.width, this.to.width - this.from.width, this.duration)),
        height: Math.round(this.easing(time - this.startTime, this.from.height, this.to.height - this.from.height, this.duration))
      });
      return false;
    }
  }

  matches(tween: TranslateTween) {
    return this.execute === tween.execute && this.widget === tween.widget;
  }
}

export class LineTween implements Tween {
  private endTime: number;
  private startTime: number;
  private easing: Easing;
  private from: EdgeState;
  private to: EdgeState;
  private dx1: number;
  private dy1: number;
  private dx2: number;
  private dy2: number;
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;

  constructor(
    protected widget: Widget,
    private duration: number,
    to: EdgeState,
    easing?: Easing
  ) {
    const from = widget.state as EdgeState;
    this.from = from;
    this.to = to;
    this.dx1 = to.x1 - from.x1;
    this.dy1 = to.y1 - from.y1;
    this.dx2 = to.x2 - from.x2;
    this.dy2 = to.y2 - from.y2;
    this.x1 = from.x1;
    this.y1 = from.y1;
    this.x2 = from.x2;
    this.y2 = from.y2;
    this.easing = easing || Easings.easeOutCirc;
    this.startTime = window.performance.now();
    this.endTime = this.startTime + duration; //(((this.x1 === x2 || Math.abs(x2 - this.x1) <= 0.001) && ((this.y1 === y2 || Math.abs(this.y1 - y2) <= 0.001)) ) ? 0 : duration);
  }

  execute(time: number): boolean {

    if (time >= this.endTime) {
      this.widget.refresh(this.to as State);
      return true;
    } else {
      this.widget.refresh(<EdgeState>{
        ...this.from,
        x1: this.easing(time - this.startTime, this.x1, this.dx1, this.duration),
        y1: this.easing(time - this.startTime, this.y1, this.dy1, this.duration),
        x2: this.easing(time - this.startTime, this.x2, this.dx2, this.duration),
        y2: this.easing(time - this.startTime, this.y2, this.dy2, this.duration)
      });
      return false;
    }
  }

  matches(tween: LineTween) {
    return this.execute === tween.execute && this.widget === tween.widget;
  }
}

