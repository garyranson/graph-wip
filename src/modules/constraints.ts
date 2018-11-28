import {SizeLike, State, VertexState} from "core/types";
import {ShapeLibrary} from "modules/shape-library";
import {Graph} from "modules/graph";

export interface ModelConstraints {
  isSelectable(state: State|string) : boolean;
  getMinSize(state: VertexState) : SizeLike;
  getMaxSize(state: VertexState) : SizeLike;
}

export const ModelConstraintsModule = {
  $type: ModelConstraints,
  $inject: [ 'ShapeLibrary','Graph'],
  $name: 'ModelConstraints'
}

function ModelConstraints(shapes: ShapeLibrary,graph: Graph): ModelConstraints {

  function getMinSize(state: VertexState) : SizeLike {
    return shapes.get(state.type).minumumSize;
  }
  function getMaxSize(state: VertexState) : SizeLike {
    return shapes.get(state.type).maximumSize;
  }

  function isSelectable(state: State|string) : boolean {
    if(!state) return false;
    const s = typeof state === 'string' ? graph.getState(state) : state;
    return s && shapes.get(s.type).isSelectable ? true : false;
  }


  return {
    getMinSize,
    getMaxSize,
    isSelectable,
  }
}
