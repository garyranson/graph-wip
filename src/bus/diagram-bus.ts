import {createDelegate, ExceptionCallback, EventDelegate} from "../core/event-delegate";
import {StateIdType} from "core/types";

export interface DiagramInitEvent {
  container: Element
}

export interface DiagramBus {
  diagramInit : EventDelegate<DiagramInitEvent>;
  diagramDestroy : EventDelegate<any>;
  diagramResize : EventDelegate<void>;
  canvasRefresh: EventDelegate<RefreshDiagramEvent>;
}

export interface RefreshDiagramEvent {
  vertices: Set<StateIdType>;
  edges: Set<StateIdType>;
  removes: Set<StateIdType>;
}


export function createDiagramBus(callback?: ExceptionCallback) : DiagramBus {
  return {
    diagramInit: createDelegate<DiagramInitEvent>(callback),
    diagramDestroy: createDelegate<any>(callback),
    diagramResize: createDelegate<void>(callback),
    canvasRefresh: createDelegate<RefreshDiagramEvent>(callback)
  }
}
