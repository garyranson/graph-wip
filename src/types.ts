

import Size from "./Utils/size";
import Point from "./Utils/Point";

export default interface ICloneable {
  clone() : any;
}

export interface GpNode {
  x: number;
  y: number;
  width: number;
  height: number;
  template: string;

  getId(): number;
  setParent(value: GpParentNode) : void;
  getParent(): GpParentNode;getBounds();
  getSize(): Size;
  setSize(width: number, height: number): void;
  setLocation(x: number, y: number): void;
  getLocation(): Point;
  getLocalLocation() : Point;
  isContainer():boolean;
  hasChildren(): boolean;
  getChildren(): GpNode[];
  removeChild(child: GpNode): void;
  appendChild(child: GpNode): void;
}

export interface GpParentNode extends GpNode {
}

export interface GpGraph {

  getRoot(): GpParentNode;

  createId(): number;

  createObject(template: string, x: number, y: number, width: number, height: number): GpNode;

  createContainerObject(template: string, x: number, y: number, width: number, height: number): GpParentNode;

  bindView(view:GpGraphView) : void;

  triggerResize(obj: GpNode): void;

  triggerCreate(obj: GpNode): void;

  triggerMove(obj: GpNode): void;

  triggerDelete(obj: GpNode): void;
}


export interface GpGraphView {
  getInstance(id: number): GpNodeView;

  getContainer(): Element;

  triggerResize(obj: GpNode): void;

  triggerCreate(obj: GpNode): void;

  triggerMove(obj: GpNode): void;

  triggerDelete(obj: GpNode): void;

  initialize(layers: GpParentNode[]): void;

  appendNodeView(view: GpNodeView): void;
}

export interface GpNodeView {
  appendChild(child: GpNodeView): void;

  remove(): void;

  getRoot(): Element;

  getNode(): GpNode;

  refresh(): void;

  addClass(name: string);
  removeClass(name: string);

}


export interface GpNodeTemplate {
  createView(node: GpNode): GpNodeView;
}

export interface GraphGestureEvent {
  instance: GpNodeView,
  context: GpNode,
  nodeId: string,
  action: string,
  data: string
}

export type TemplateAction = (el: Element, gp: object) => void;
export type TemplateExec = (gp: object) => void;
export type TemplateActionFactory = (s: string) => TemplateAction;

export interface DragHandlerData {
  pointerX: number,
  pointerY: number,
  targetElement: Element
}


export interface DragHandler {
  init(data: DragHandlerData):void;
  start(e: MouseEvent, data: DragHandlerData) : void;
  move(e: MouseEvent): void;
  drop(e: MouseEvent) : void;
  targetChange(curr: GraphGestureEvent, prev: GraphGestureEvent);
  getState() : GpNodeView;
  over(e: MouseEvent): void;
  cancel(): void;
}


export interface HoverHandler {
  canCancel(e: MouseEvent): boolean;
  cancel(e: MouseEvent): void;
}
