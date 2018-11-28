import {Easing, Tween} from "animate/types";
import {EdgeState} from "core/types";
import {Widget} from "template/widget";

export class LineTween implements Tween {
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
    public widget: Widget<EdgeState>,
    to: EdgeState
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
  }

  execute(time: number,duration: number, easing: Easing): void {
    this.widget.refresh(<EdgeState>{
      ...this.from,
      x1: this.dx1 ? easing(time, this.x1, this.dx1, duration) : this.to.x1,
      y1: this.dy1 ? easing(time, this.y1, this.dy1, duration) : this.to.y1,
      x2: this.dx2 ? easing(time, this.x2, this.dx2, duration) : this.to.x2,
      y2: this.dy2 ? easing(time, this.y2, this.dy2, duration) : this.to.y2
    });
  }

  complete() :void {
    this.widget.refresh(this.to);
  }

  matches(tween: Tween) : boolean {
    return this.execute === tween.execute && this.widget === (<any>tween).widget;
  }
}
