import {createDelegate, ExceptionCallback, EventDelegate} from "../core/event-delegate";
import {RectangleLike, StateIdType} from "core/types";

export interface ModelBusEvent {
  id: StateIdType;
  eventType: string;
}

export interface ModelBusMoveNodeEvent extends ModelBusEvent {
  target: StateIdType;
  x: number,
  y: number,
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
  moveNode: EventDelegate<ModelBusMoveNodeEvent>;
  resizeNode: EventDelegate<ModelBusResizeNodeEvent>;
  createEdge: EventDelegate<ModelBusCreateEdgeEvent>;
}

export function createModelBus(callback?: ExceptionCallback): ModelBus {
  return {
    createNode: createDelegate<ModelBusEvent>(callback),
    removeNode: createDelegate<ModelBusEvent>(callback),
    selectNode: createDelegate<NodeBusSelectEvent>(callback),
    moveNode: createDelegate<ModelBusMoveNodeEvent>(callback),
    resizeNode: createDelegate<ModelBusResizeNodeEvent>(callback),
    createEdge: createDelegate<ModelBusCreateEdgeEvent>(callback),
  }
}

