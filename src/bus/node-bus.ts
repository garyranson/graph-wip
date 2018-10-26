import {createDelegate, DelegateCallbackCreator, EventDelegate} from "../core/event-delegate";
import {RectangleLike, StateIdType} from "core/types";

export interface NodeBusEvent {
  id: StateIdType;
  eventType: string;
  payload: any;
}

export interface NodeBusSelectEvent {
  bounds: RectangleLike;
}

export interface NodeBus {
  nodeCreate: EventDelegate<NodeBusEvent>;
  nodeRemove: EventDelegate<NodeBusEvent>;
  nodeRefresh: EventDelegate<NodeBusEvent>;
  nodeSelect: EventDelegate<NodeBusSelectEvent>;
}

export function createNodeBus (callback?: DelegateCallbackCreator) : NodeBus {
  return {
    nodeCreate: createDelegate<NodeBusEvent>(callback),
    nodeRemove: createDelegate<NodeBusEvent>(callback),
    nodeRefresh: createDelegate<NodeBusEvent>(callback),
    nodeSelect: createDelegate<NodeBusSelectEvent>(callback),
  }
}

