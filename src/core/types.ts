import {WidgetDragDropEvent, WidgetDragEvent} from "drag-handlers/types";

export type StateIdType = string;

export interface ShapeType {
  name: string;
  parent?: string;
  minumumSize?: SizeLike,
  maximumSize?: SizeLike,
  canContain?: string[];
  layoutManager?: string;
  returnType?: string;
  isSelectable?: boolean;
  hasFeedback?: string;
}

export interface StateMeta {
  ports: number[][];
}

export interface State {
  type: string;
  id: StateIdType;
  class: "vertex" | "edge";
  __meta?: StateMeta;
}

export interface VertexState extends State, RectangleLike {
  class: "vertex";
  parent: StateIdType,
}


export interface VertexMove {
  action: "before"|"after"|"start"|"end",
  id?: StateIdType
}


export interface DragFeedback {
  destroy(): void;

  drop(e: WidgetDragDropEvent): void;

  move(e: WidgetDragEvent): void;
}

export interface DragFeedbackFactory {
  (vertexId: StateIdType, overState: StateIdType): DragFeedback
}


export interface EdgeRouteLike {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  route?: PointLike[];
}

export interface EdgeState extends State, EdgeRouteLike {
  from: StateIdType,
  to: StateIdType
  class: "edge";
  callback?: any;
  sourcePortIndex?: number;
  targetPortIndex?: number;
}


export interface WidgetAttributes {
  id: StateIdType;
  action: string;
  data: string;
}



export interface RectangleLike extends Object {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PointLike {
  x: number;
  y: number;
}


export interface LineLike extends Object {

  x1: number,
  y1: number,
  x2: number,
  y2: number
}

export interface BoundsLike {
  t: number;
  l: number;
  b: number;
  r: number;
}

export interface SizeLike {
  width: number,
  height: number
}



