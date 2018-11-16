import {AppBus} from "bus/app-bus";
import {ModelBusCreateEdgeEvent, ModelBusMoveNodeEvent, ModelBusResizeNodeEvent} from "bus/model-bus";
import {EdgeState, RectangleLike, StateIdType, VertexState} from "core/types";
import {Store} from "modules/store";
import {IdGenerator} from "modules/id-generator";
import {ShapeLibrary} from "modules/shape-library";

export interface ModelController {
  createRoot(type: string, rect: RectangleLike, parent: StateIdType): VertexState;

  createVertex(type: string, rect: RectangleLike, parent: StateIdType): VertexState;

  createEdge(type: string, from: StateIdType, to: StateIdType): EdgeState;

  removeVertex(id: StateIdType): void;

  removeEdge(id: StateIdType): void;

  getVertexCanvasBounds(id: StateIdType) : RectangleLike;
}

export const ModelControllerModule = {
  $type: ModelController,
  $inject: ['AppBus', 'Store', 'IdGenerator','ShapeLibrary'],
  $name: 'ModelController'
}

function ModelController(
  appBus: AppBus,
  store: Store,
  createId: IdGenerator,
  shapes: ShapeLibrary
): ModelController {

  appBus.moveNode.add((ne: ModelBusMoveNodeEvent) => vertexMove(ne.id, ne.x, ne.y, ne.target));
  appBus.resizeNode.add((ne: ModelBusResizeNodeEvent) => vertexResize(ne.id, ne.bounds));
  appBus.createEdge.add((ne: ModelBusCreateEdgeEvent) => createEdge('$connector', ne.from, ne.to));

  function createRoot(type: string, rect: RectangleLike): VertexState {
    return store.createRoot({$type: shapes.get(type), ...rect, id: createId.create(), type, parent: null, class: "vertex"})
  }

  function createVertex(type: string, rect: RectangleLike, parent: StateIdType): VertexState {
    return store.createVertex({$type: shapes.get(type),...rect, id: createId.create(), type, parent, class: "vertex"})
  }

  function createEdge(type: string, from: StateIdType, to: StateIdType): EdgeState {
    return store.createEdge({$type: shapes.get(type),type, id: createId.create(), from, to, x1: 0, y1: 0, x2: 0, y2: 0, class: "edge"});
  }

  function vertexResize(vertexId: StateIdType, bounds: RectangleLike) {
    const vertex = store.getVertex(vertexId);
    if (!vertex) return;
    store.updateVertex({...vertex, x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height});
  }

  function vertexMove(vertexId: StateIdType, x: number, y: number, parent: StateIdType) {
    const vertex = store.getVertex(vertexId);
    if (!vertex) return;
    if (x === vertex.x && y === vertex.y) return;
    store.updateVertex({...vertex, x, y, parent});
  }

  function removeEdge(id: StateIdType): void {
    store.removeEdge(id);
  }

  function removeVertex(id: StateIdType): void {
    store.removeVertex(id);
  }

  function getVertexCanvasBounds(id: StateIdType): RectangleLike {
    let s = store.getVertex(id);
    if (!s) return {x: 0, y: 0, width: 0, height: 0};
    let x = 0;
    let y = 0;
    let w = s.width;
    let h = s.height;

    while (s.parent) {
      x += s.x;
      y += s.y;
      s = store.getVertex(s.parent);
    }
    return {x, y, width: w, height: h};
  }


  return {
    createVertex,
    createRoot,
    removeVertex,
    createEdge,
    removeEdge,
    getVertexCanvasBounds
  }
}



