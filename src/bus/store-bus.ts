import {createDelegate, DelegateCallbackCreator, EventDelegate} from "../core/event-delegate";
import {StateIdType} from "core/types";


export interface StoreBusEvent {
  type: string;
  id: StateIdType;
}

export interface StoreBus {
  storeUpdate: EventDelegate<StoreBusEvent>;
}

export function createStoreBus(callback?: DelegateCallbackCreator) : StoreBus {
  return {
    storeUpdate: createDelegate<StoreBusEvent>(callback),
  }
}
