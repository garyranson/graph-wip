import {StateIdType, VertexState} from "core/types";
import {Graph} from "modules/graph";
import {ShapeLibrary} from "modules/shape-library";

export interface ContainmentManager {
  canContain(parent: StateIdType, child: StateIdType): boolean;
  getClosestContainer(parent: StateIdType, child: StateIdType): StateIdType;
}

export const ContainmentManagerModule = {
  $type: ContainmentManager,
  $inject: ['Graph', 'ShapeLibrary'],
  $name: 'ContainmentManager'
}

function ContainmentManager(graph: Graph
  , shapes: ShapeLibrary
): ContainmentManager {
  return {
    canContain,
    getClosestContainer
  }

  function canContain(parent: StateIdType, child: StateIdType): boolean {
    if (!child || !parent || parent === child) return;
    const target = graph.getState(parent);
    const source = graph.getState(child);
    if (!target || !source) return false;
    return _canContain(target.type,shapes.get(source.type).name);
  }

  // gets a container that can container the child
  function getClosestContainer(parent: StateIdType, child: StateIdType): StateIdType {
    if (!child || !parent || parent === child) return;
    const source = graph.getState(child);
    if (!source) return;

    let p = parent;
    const sourceType = shapes.get(source.type).name;

    while (p) {
      const target = graph.getState(p) as VertexState;
      if(!target) return;
      if(_canContain(target.type,sourceType))
        return target.id;

      p = target.parent;
    }
  }

  function _canContain(targetType:string, sourceType: string ) : boolean {
    const tc = shapes.get(targetType).canContain;
    if (tc && tc.indexOf(sourceType) !== -1)
      return true;
    return false;
  }
}
