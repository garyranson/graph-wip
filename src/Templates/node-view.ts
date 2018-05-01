import {GpNode, GpNodeView, TemplateExec} from "../types";

export default class GpNodeViewImpl implements GpNodeView  {
  element: Element;
  exec: TemplateExec;
  node: GpNode;

  constructor(root: Element, exec: TemplateExec, context: GpNode) {
    this.element = root;
    this.exec = exec;
    this.node = context;
  }

  appendChild(child: GpNodeView) {
    if(child) {
      this.element.appendChild(child.getRoot());
    }
  }

  remove() {
    this.element.remove();
  }

  getRoot() : Element {
    return this.element;
  }

  getNode() : GpNode {
    return this.node;
  }

  refresh() : void {
    this.exec(this.node);
  }

  addClass(name: string) : GpNodeView {
    this.element.classList.add(name);
    return this;
  }

  removeClass(name: string) : GpNodeView {
    this.element.classList.remove(name);
    return this;
  }

  setAttribute(name: string, value: any) : GpNodeView {
    this.element.setAttribute(name,value);
    return this;
  }
}
