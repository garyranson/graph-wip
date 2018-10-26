import {AppBus} from "bus/app-bus";
import {NodeBusEvent} from "bus/node-bus";
import {EdgeState, PointLike, RectangleLike, StateIdType, VertexState} from "core/types";
import {Store} from "modules/store";
import {IdGenerator} from "modules/id-generator";

export interface ModelController {
  createVertex(type: string, rect: RectangleLike, parent: StateIdType): VertexState;

  createEdge(type: string, from: StateIdType, to: StateIdType): EdgeState;

  removeVertex(id: StateIdType): void;

  removeEdge(id: StateIdType): void;
}

export const ModelControllerModule = {
  $type: ModelController,
  $inject: ['AppBus', 'Store', 'IdGenerator'],
  $name: 'ModelController'
}

function ModelController(
  appBus: AppBus,
  store: Store,
  createId: IdGenerator
): ModelController {

  appBus.nodeRefresh.add((ne: NodeBusEvent) => {
    switch (ne.eventType) {
      case 'move' :
        return vertexMove(ne.id, ne.payload.bounds, ne.payload.target);
      case 'resize' :
        return vertexResize(ne.id, ne.payload.bounds);
      case 'create/edge' :
        return createEdge('$connector', ne.payload.from, ne.payload.to);
    }
  });

  function createVertex(type: string, rect: RectangleLike, parent: StateIdType): VertexState {
    return store.createVertex({...rect, id: createId.create(), type, parent: parent || '0', class: "vertex"})
  }

  function createEdge(type: string, from: StateIdType, to: StateIdType): EdgeState {
    return store.createEdge({type, id: createId.create(), from, to, x1: 0, y1: 0, x2: 0, y2: 0, class: "edge"});
  }

  function vertexResize(vertexId: StateIdType, bounds: RectangleLike) {
    const vertex = store.getVertex(vertexId);
    if (!vertex) return;
    store.updateVertex({...vertex, x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height});
  }

  function vertexMove(vertexId: StateIdType, bounds: PointLike, parent: StateIdType) {
    const vertex = store.getVertex(vertexId);
    if (!vertex) return;
    const {x, y} = bounds;
    if (x === vertex.x && y === vertex.y) return;
    store.updateVertex({...vertex, x, y, parent});
  }

  function removeEdge(id: StateIdType): void {
    store.removeEdge(id);
  }

  function removeVertex(id: StateIdType): void {
    store.removeVertex(id);
  }

  return {
    createVertex,
    removeVertex,
    createEdge,
    removeEdge
  }
}
