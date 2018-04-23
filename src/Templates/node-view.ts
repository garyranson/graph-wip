import {GpNode, GpNodeView, TemplateExec} from "../types";

export default class GpNodeViewImpl implements GpNodeView  {
  root: Element;
  exec: TemplateExec;
  context: GpNode;
  constructor(root: Element, exec: TemplateExec, context: GpNode) {
    this.root = root;
    this.exec = exec;
    this.context = context;
  }

  appendChild(child: GpNodeView) {
    if(child) {
      this.root.appendChild(child.getRoot());
    }
  }

  remove() {
    this.root.remove();
  }

  getRoot() : Element {
    return this.root;
  }

  getNode() : GpNode {
    return this.context;
  }

  refresh() : void {
    this.exec(this.context);
  }

  addClass(name: string) {
    this.root.classList.add(name);
  }

  removeClass(name: string) {
    this.root.classList.remove(name);
  }
}
