import {StateIdType} from "core/types";

export interface ConnectionManager {
  canConnect(from: StateIdType, to: StateIdType) : boolean;
}

export const ConnectionManagerModule = {
  $type: ConnectionManager,
  $inject: [],
  $name: 'ConnectionManager'
}

function ConnectionManager() : ConnectionManager {
  return {
    canConnect
  }

  function canConnect(from: StateIdType, to: StateIdType) : boolean {
    return true;
  }
}
