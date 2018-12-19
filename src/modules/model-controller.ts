import {AppBus} from "bus/app-bus";
import {ModelBusCreateEdgeEvent, ModelBusMoveNodeEvent, ModelBusResizeNodeEvent} from "bus/model-bus";
import {RectangleLike, StateIdType, VertexMove} from "core/types";
import {Graph} from "modules/graph";
import {IdGenerator} from "modules/id-generator";

export interface ModelController {
  createRoot(type: string): StateIdType;

  createVertex(id: StateIdType, type: string, rect: RectangleLike, parent: StateIdType): void;

  createEdge(type: string, from: StateIdType, to: StateIdType, sourcePortIndex: number, targetPortIndex: number): void;

  removeVertex(id: StateIdType): void;

  removeEdge(id: StateIdType): void;
}

export const ModelControllerModule = {
  $type: ModelController,
  $inject: ['AppBus', 'Graph', 'IdGenerator'],
  $name: 'ModelController'
}

const ports = [
  [0.5,0],
  [1,0.5],
  [0.5,1],
  [0,0.5]
];

const __meta = {
  ports : ports,
  minSize: {width:120, height:80},
  maxSize: {width:999, height:999}
};

function ModelController(
  appBus: AppBus,
  graph: Graph,
  createId: IdGenerator
): ModelController {

  appBus.moveNode.add((ne: ModelBusMoveNodeEvent) => vertexMove(ne.id, ne.x, ne.y, ne.target, ne.index));
  appBus.resizeNode.add((ne: ModelBusResizeNodeEvent) => vertexResize(ne.id, ne.bounds));
  appBus.createEdge.add((ne: ModelBusCreateEdgeEvent) => createEdge('$connector', ne.from, ne.to, ne.sourcePortIndex, ne.targetPortIndex));

  function createRoot(type: string): StateIdType {
    const id = createId.create();
    graph.createRoot({x: 0, y: 0, width: 0, height: 0, id, type, parent: null, class: "vertex"})
    return id;
  }

  function createVertex(id: StateIdType, type: string, rect: RectangleLike, parent: StateIdType): void {
    graph.createVertex({...rect, id: id||createId.create(), type, parent, class: "vertex", __meta})
  }

  function createEdge(type: string, from: StateIdType, to: StateIdType, sourcePortIndex: number, targetPortIndex: number): void {
    const e = graph.createEdge({type, id: createId.create(), from, to, x1: 0, y1: 0, x2: 0, y2: 0, class: "edge", sourcePortIndex, targetPortIndex});
    console.log('creating edge:'+JSON.stringify(e));
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



