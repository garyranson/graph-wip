import {createDelegate, ExceptionCallback, EventDelegate} from "../core/event-delegate";
import {StateIdType} from "core/types";


export interface StoreBusEvent {
  type: string;
  id: StateIdType;
  force?: boolean;
}

export interface StoreBus {
  storeUpdate: EventDelegate<StoreBusEvent>;
}

export function createStoreBus(callback?: ExceptionCallback) : StoreBus {
  return {
    storeUpdate: createDelegate<StoreBusEvent>(callback),
  }
}
