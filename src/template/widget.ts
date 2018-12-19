import {WidgetExecFactory} from "./types";

export class Widget {
  private container: Element;
  private linked: Widget[];

  constructor(public type: string,private element: Element, private mappedElements: Element[], private exec: WidgetExecFactory) {
    this.container = element.querySelector('[data-class-config]') || element;
  }

  appendChild(child: Widget) {
    if (!child) return;
    this.container.appendChild(child.getElement());
  }

  remove() {
    this.element.remove();
  }

  getElement<T extends Element>(): T {
    return this.element as T;
  }

  addLinkedWidget(widget: Widget): void {
    this.linked = this.linked ? this.linked.concat(widget) : [widget];
    this.element.appendChild(widget.getElement());
  }

  removeLinkedWidget(widget: Widget): void {
    if (!this.linked) return;
    this.linked = removeLinkedWidget(this.linked,widget);
  }

  refresh(state: object): this {
    if(!state) return this;
    this.exec(state, this.mappedElements);
    if (this.linked) this.linked.forEach((w) => w.refresh(state));
    return this;
  }

  addClass(name: string): this {
    if(name) this.element.classList.add(name);
    return this;
  }

  removeClass(name: string): this {
    if(name)this.element.classList.remove(name);
    return this;
  }

  setAttribute(name: string, value: any): this {
    this.element.setAttribute(name, value);
    return this;
  }

  getBoundingBox(): ClientRect | DOMRect {
    return this.element.getBoundingClientRect();
  }
}


function removeLinkedWidget(linked: Widget[], widget: Widget): Widget[] {
  return linked.length === 1
    ? linked[0] !== widget
      ? linked
      : null
    : linked.filter((i) => i !== widget);
}
