import {WidgetExecFactory} from "./types";
import {State} from "core/types";

export interface Widget  {
  state: State;
  appendChild(child: Widget): void;
  remove(): void;
  getElement() : Element;
  refresh(state: State) : this;
  addClass(name: string) : this;
  removeClass(name: string) : this;
  setAttribute(name: string, value: any) : this;
}

export class VertexWidget implements Widget  {
  public state: State;
  public container: Element;

  constructor(private element: Element, private mappedElements: Element[], private exec: WidgetExecFactory) {
    this.container = element.querySelector('[data-gp-config]') || element;
  }

  appendChild(child: Widget) {
    if (!child) return;
    this.container.appendChild(child.getElement());
  }

  remove() {
    this.element.remove();
  }

  getElement() : Element {
    return this.element;
  }

  refresh(state: State) : this {
    this.exec(state, this.mappedElements);
    this.state = state;
    return this;
  }

  addClass(name: string) : this {
    this.element.classList.add(name);
    return this;
  }

  removeClass(name: string) : this {
    this.element.classList.remove(name);
    return this;
  }

  setAttribute(name: string, value: any) : this {
    this.element.setAttribute(name,value);
    return this;
  }
}
