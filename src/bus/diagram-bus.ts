import {createDelegate, DelegateCallbackCreator, EventDelegate} from "../core/event-delegate";

export interface DiagramInitEvent {
  container: Element
}

export interface DiagramBus {
  diagramInit : EventDelegate<DiagramInitEvent>;
  diagramDestroy : EventDelegate<any>;
  diagramResize : EventDelegate<void>;
}

export function createDiagramBus(callback?: DelegateCallbackCreator) : DiagramBus {
  return {
    diagramInit: createDelegate<DiagramInitEvent>(callback),
    diagramDestroy: createDelegate<any>(callback),
    diagramResize: createDelegate<void>(callback)
  }
}
