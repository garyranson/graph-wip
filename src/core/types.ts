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
}

export interface State {
  $type: ShapeType;
  type: string;
  id: StateIdType;
  class: "vertex"|"edge";
}

export interface VertexState extends State, RectangleLike {
  class: "vertex";
  parent: StateIdType
}

export interface EdgeRouteLike {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  route?: [];
}

export interface EdgeState extends State, EdgeRouteLike {
  from: StateIdType,
  to: StateIdType
  class: "edge";
  callback?: any;
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


export interface VectorLike {
  x: number;
  y: number;
  z: number;
}

export interface SizeLike {
  width: number,
  height: number
}



