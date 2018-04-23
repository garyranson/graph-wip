import {GpGraph, GpGraphView, GpNode, GpParentNode} from "../types";
import GpNodeImpl from "./node";
import GpParentNodeImpl from "./parent-node";

export default class GpGraphImpl implements GpGraph {
  readonly rootNode: GpParentNode;
  private view: GpGraphView;

  private id = 0;

  getRoot(): GpParentNode {
    return this.rootNode;
  }

  public static create() {
    return new GpGraphImpl() as GpGraph;
  }

  constructor() {
    this.id = 0;
    this.rootNode = new GpParentNodeImpl(this, "rootNode", 0, 0, 2000, 2000);
  }

  bindView(view:GpGraphView) : void {
    this.view = view;
    view.initialize([
      this.rootNode
    ]);
  }

  createId(): number {
    return this.id++;
  }

  createObject(template: string, x: number, y: number, width: number, height: number): GpNode {
    return new GpNodeImpl(this, template, x, y, width, height);
  }

  createContainerObject(template: string, x: number, y: number, width: number, height: number): GpParentNode {
    return new GpParentNodeImpl(this, template, x, y, width, height);
  }

  triggerResize(obj: GpNode) {
    if (this.view) this.view.triggerResize(obj);
  }

  triggerCreate(obj: GpNode) {
    if (this.view) this.view.triggerCreate(obj);
  }

  triggerMove(obj: GpNode) {
    if (this.view) this.view.triggerMove(obj);
  }

  triggerDelete(obj: GpNode) {
    if (this.view) this.view.triggerDelete(obj);
  }
}


