import {createDelegate, ExceptionCallback, EventDelegate} from "../core/event-delegate";
import {RectangleLike, StateIdType, VertexMove} from "core/types";

export interface ModelBusEvent {
  id: StateIdType;
  eventType: string;
}

export interface ModelBusMoveNodeEvent2 extends ModelBusEvent {
  target: StateIdType;
  index: VertexMove;
}
export interface ModelBusMoveNodeEvent1 extends ModelBusEvent {
  target: StateIdType;
  x: number;
  y: number;
}

export interface ModelBusResizeNodeEvent extends ModelBusEvent {
  bounds: any;
}

export interface ModelBusCreateEdgeEvent extends ModelBusEvent {
  from: StateIdType,
  to: StateIdType
}

export interface NodeBusSelectEvent {
  bounds: RectangleLike;
}

export interface ModelBus {
  createNode: EventDelegate<ModelBusEvent>;
  removeNode: EventDelegate<ModelBusEvent>;
  selectNode: EventDelegate<NodeBusSelectEvent>;
  moveNode: EventDelegate<ModelBusMoveNodeEvent1|ModelBusMoveNodeEvent1>;
  resizeNode: EventDelegate<ModelBusResizeNodeEvent>;
  createEdge: EventDelegate<ModelBusCreateEdgeEvent>;
}

export function createModelBus(callback?: ExceptionCallback): ModelBus {
  return {
    createNode: createDelegate<ModelBusEvent>(callback),
    removeNode: createDelegate<ModelBusEvent>(callback),
    selectNode: createDelegate<NodeBusSelectEvent>(callback),
    moveNode: createDelegate<ModelBusMoveNodeEvent1|ModelBusMoveNodeEvent1>(callback),
    resizeNode: createDelegate<ModelBusResizeNodeEvent>(callback),
    createEdge: createDelegate<ModelBusCreateEdgeEvent>(callback),
  }
}

