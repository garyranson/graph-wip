import {Tween} from "animate/types";
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

  private route: any[];

  constructor(
    public widget: Widget,
    from: EdgeState,
    to: EdgeState
  ) {
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

  init() {
    if (!this.from.route && !this.to.route) {
      return;
    }
    const from = this.from.route;
    const to = this.to.route;

    if (from && to && from.length === 0 && to.length === 0) return;

    const f = from ? from.slice() : [];
    const t = to ? to.slice() : [];

    if (f.length < t.length) {
      const a = f.length ? f[f.length-1] : {x: this.from.x1, y: this.from.y1};
      while (f.length < t.length) {
        f.push(a);
      }
    }

    if(t.length < f.length) {
      const a = t.length ? t[t.length - 1] : {x: this.to.x2, y: this.to.y2};
      while (t.length < f.length) {
        t.push(a);
      }
    }

    const r = [];
    for (let i = 0; i < f.length; i++) {
      r.push({
        x: f[i].x,
        y: f[i].y,
        dx: t[i].x - f[i].x,
        dy: t[i].y - f[i].y
      });
    }
    this.route = r;
  }

  execute(value: number): void {
    this.widget.refresh({
      ...this.from,
      x1: this.x1 + this.dx1 * value,
      y1: this.y1 + this.dy1 * value,
      x2: this.x2 + this.dx2 * value,
      y2: this.y2 + this.dy2 * value,
      route: this.route && this.route.map((e) => ({x: e.x + (e.dx * value), y: e.y + (e.dy * value)}))
    });
  }

  complete(): void {
    this.widget.refresh(this.to);
  }

  matches(tween: Tween): boolean {
    return this.execute === tween.execute && this.widget === (<any>tween).widget;
  }
}
