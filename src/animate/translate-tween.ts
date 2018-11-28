import {Easing, Tween} from "./types";
import {Widget} from "template/widget";
import {State, VertexState} from "core/types";

export class TranslateTween implements Tween {
  private dx: number;
  private dy: number;
  private dh: number;
  private dw: number;

  constructor(
    public widget: Widget<VertexState>,
    private from: VertexState,
    private to: VertexState,
    private parent?: Widget<State>,
  ) {
    this.dx = Math.round(this.to.x - this.from.x);
    this.dy = Math.round(this.to.y - this.from.y);
    this.dh = Math.round(this.to.height - this.from.height);
    this.dw = Math.round(this.to.width - this.from.width);
  }

  init() : void {
    if (this.parent) this.parent.appendChild(this.widget);
  }

  execute(time: number, duration: number, easing: Easing): void {
    this.widget.refresh({
      ...this.from,
      x: this.dx ? Math.round(easing(time, this.from.x, this.dx, duration)) : this.to.x,
      y: this.dy ? Math.round(easing(time, this.from.y, this.dy, duration)) : this.to.y,
      width: this.dw ? Math.round(easing(time, this.from.width, this.dw, duration)) : this.to.width,
      height: this.dh ? Math.round(easing(time, this.from.height, this.dh, duration)) : this.to.height
    });
  }

  complete(): void {
    this.widget.refresh(this.to);
  }

  matches(tween: Tween): boolean {
    return this.execute === tween.execute && this.widget === (<any>tween).widget;
  }
}
