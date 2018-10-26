export type StateIdType = string;

export interface State {
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



export interface RectangleLike {
  x: number;
  y: number;
  width: number;
  height: number;
}


export interface SizeLike {
  width: number;
  height: number;
}

export interface PointLike {
  x: number;
  y: number;
}
