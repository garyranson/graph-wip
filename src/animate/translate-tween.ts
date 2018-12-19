import {Tween} from "./types";
import {Widget} from "template/widget";
import {VertexState} from "core/types";

export class TranslateTween implements Tween {
  private dx: number;
  private dy: number;
  private dh: number;
  private dw: number;

  constructor(
    public widget: Widget,
    private from: VertexState,
    private to: VertexState,
    private parent?: Widget,
  ) {
    this.dx = Math.round(this.to.x - this.from.x);
    this.dy = Math.round(this.to.y - this.from.y);
    this.dh = Math.round(this.to.height - this.from.height);
    this.dw = Math.round(this.to.width - this.from.width);
  }

  init(): void {
    if (this.parent) this.parent.appendChild(this.widget);
  }

  execute(value: number): void {
    this.widget.refresh({
      ...this.from,
      x: Math.round(this.from.x + this.dx * value),
      y: Math.round(this.from.y + this.dy * value),
      width: Math.round(this.from.width + this.dw * value),
      height: Math.round(this.from.height + this.dh * value)
    });
  }

  complete(): void {
    this.widget.refresh(this.to);
  }

  matches(tween: Tween): boolean {
    return this.execute === tween.execute && this.widget === (<any>tween).widget;
  }
}
