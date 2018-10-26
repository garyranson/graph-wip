import {StateIdType} from "core/types";

export interface IdGenerator {
  create(): StateIdType;
}

export const IdGeneratorModule = {
  $type: IdGenerator,
  $name: 'IdGenerator'
}

function IdGenerator(): IdGenerator {
  let last = 0
  let id = 0;

  return {
    create: createId
  }

  function createId() {
    const n = Date.now();
    if (n === last) return `${n.toString(36)}:${(++id).toString(36)}`;
    id = 0;
    last = n;
    return n.toString(36);
  }
}
