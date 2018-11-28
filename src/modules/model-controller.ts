import {AppBus} from "bus/app-bus";
import {ModelBusCreateEdgeEvent, ModelBusMoveNodeEvent, ModelBusResizeNodeEvent} from "bus/model-bus";
import {EdgeState, RectangleLike, StateIdType, VertexMove, VertexState} from "core/types";
import {Graph} from "modules/graph";
import {IdGenerator} from "modules/id-generator";

export interface ModelController {
  createRoot(id: StateIdType,type: string): VertexState;

  createVertex(id: StateIdType,type: string, rect: RectangleLike, parent: StateIdType): VertexState;

  createEdge(type: string, from: StateIdType, to: StateIdType): EdgeState;

  removeVertex(id: StateIdType): void;

  removeEdge(id: StateIdType): void;
}

export const ModelControllerModule = {
  $type: ModelController,
  $inject: ['AppBus', 'Graph', 'IdGenerator'],
  $name: 'ModelController'
}

function ModelController(
  appBus: AppBus,
  graph: Graph,
  createId: IdGenerator
): ModelController {

  appBus.moveNode.add((ne: ModelBusMoveNodeEvent) => vertexMove(ne.id, ne.x, ne.y, ne.target, ne.index));
  appBus.resizeNode.add((ne: ModelBusResizeNodeEvent) => vertexResize(ne.id, ne.bounds));
  appBus.createEdge.add((ne: ModelBusCreateEdgeEvent) => createEdge('$connector', ne.from, ne.to));

  function createRoot(id: StateIdType, type: string): VertexState {
    return graph.createRoot({x: 0, y: 0, width: 0, height: 0, id: id||createId.create(), type, parent: null, class: "vertex"})
  }

  function createVertex(id: StateIdType, type: string, rect: RectangleLike, parent: StateIdType): VertexState {
    return graph.createVertex({...rect, id: id||createId.create(), type, parent, class: "vertex"})
  }

  function createEdge(type: string, from: StateIdType, to: StateIdType): EdgeState {
    return graph.createEdge({type, id: createId.create(), from, to, x1: 0, y1: 0, x2: 0, y2: 0, class: "edge"});
  }

  function vertexResize(vertexId: StateIdType, bounds: RectangleLike) {
    const vertex = graph.getVertex(vertexId);
    if (!vertex) return;
    graph.updateVertex({...vertex, x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height});
  }

  function vertexMove(vertexId: StateIdType, x: number, y: number, parent: StateIdType, index: VertexMove) {
    const vertex = graph.getVertex(vertexId);
    if (!vertex) return;
    if (x === vertex.x && y === vertex.y) return;
    graph.updateVertex({...vertex, x, y, parent},index);
  }

  function removeEdge(id: StateIdType): void {
    graph.removeEdge(id);
  }

  function removeVertex(id: StateIdType): void {
    graph.removeVertex(id);
  }

  return {
    createVertex,
    createRoot,
    removeVertex,
    createEdge,
    removeEdge
  }
}



