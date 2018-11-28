import {WidgetExecFactory} from "./types";
import {State, VertexState} from "core/types";

export class Widget<T extends State>   {
  public state: T;
  public container: Element;
  public linked: Widget<State>[];

  constructor(private element: Element, private mappedElements: Element[], private exec: WidgetExecFactory) {
    this.container = element.querySelector('[data-class-config]') || element;
  }

  getState() : T {
    return this.state;
  }

  appendChild(child: Widget<T>) {
    if (!child) return;
    this.container.appendChild(child.getElement());
  }

  remove() {
    this.element.remove();
  }

  getElement<T extends Element>() : T {
    return this.element as T;
  }

  addLinkedWidget(widget: Widget<VertexState>): void {
    this.linked = this.linked ? this.linked.concat(widget) : [widget];
  }

  removeLinkedWidget(widget: Widget<VertexState>): void {
    if (!this.linked) return;
    if (this.linked.length === 1) {
      if (this.linked[0] !== widget) return;
      this.linked = null;
      return;
    }
    this.linked = this.linked.filter((i) => i === widget);
  }


  refresh(this: Widget<T>, state: T) : Widget<T> {
    this.exec(state, this.mappedElements);
    this.state = state;
    if(this.linked) this.linked.forEach((w) => w.refresh(state));
    return this;
  }

  mergeState(state: T) : Widget<T> {
    this.state = {...(this.state as object), ...(state as object)} as T;
    return this;
  }

  addClass(name: string) : Widget<T> {
    this.element.classList.add(name);
    return this;
  }

  removeClass(name: string) : Widget<T> {
    this.element.classList.remove(name);
    return this;
  }

  setAttribute(name: string, value: any) : Widget<T> {
    this.element.setAttribute(name,value);
    return this;
  }

  getBoundingBox() : ClientRect | DOMRect {
    return this.element.getBoundingClientRect();
  }
}
