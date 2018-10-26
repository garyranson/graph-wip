import {EdgeState, State, StateIdType, VertexState} from "core/types";
import {AppBus} from "bus/app-bus";
import {clipLine} from "core/scalaclip";
import {rectMidPoint} from "core/geometry";

export interface Store {
  getEdge(id: StateIdType): EdgeState;

  updateEdge(edge: EdgeState): EdgeState;

  createEdge(edge: EdgeState): EdgeState;

  removeEdge(id: StateIdType): void;

  updateEdges(vertexId: StateIdType, fn: (EdgeState) => EdgeState): EdgeState[];

  getVertex(id: StateIdType): VertexState;

  updateVertex(edge: VertexState): VertexState;

  createVertex(edge: VertexState): VertexState;

  removeVertex(id: StateIdType): void;

  getState<T extends State>(id: StateIdType): T;
}

export const StoreModule = {
  $type: Store,
  $inject: ['AppBus'],
  $name: 'Store'
}
const _emptyArray = Object.freeze([]);

type EdgeDirection = "in" | "out";

function Store(appBus: AppBus): Store {

  const {storeUpdate} = appBus;

  interface EdgeDef {
    direction: EdgeDirection;
    edgeId: StateIdType;
    targetVertexId: StateIdType;
  }

  const states = new Map<StateIdType, State>();
  const vertexEdges = new Map<StateIdType, EdgeDef[]>();

  return {
    getVertex,
    createVertex,
    updateVertex,
    removeVertex,
    getEdge,
    createEdge,
    updateEdge,
    removeEdge,
    updateEdges,
    getState
  }

  function getState<T extends State>(id) : T {
    return states.get(id) as T;
  }

  function getEdge(edgeId: StateIdType): EdgeState {
    const edge = states.get(edgeId) as EdgeState;
    if (edge && edge.class === 'edge') return edge;
    if (!edge) return;
    throw "Expected to find an edge";
  }

  function getVertex(vertexId: StateIdType): VertexState {
    const vertex = states.get(vertexId) as VertexState;
    if (vertex && vertex.class === 'vertex') return vertex;
    if (!vertex) return;
    throw "Expected to find a vertex";
  }

  function createVertex<T extends State>(state: T): T {
    if (getVertex(state.id)) throw "State already exists";
    states.set(state.id, state);
    storeUpdate.fire({type: 'new-vertex', id: state.id});
    return state;
  }

  function updateVertex<T extends State>(state: T): T {
    if (!getVertex(state.id)) throw "State does not exist";
    states.set(state.id, state);
    storeUpdate.fire({type: 'update-vertex', id: state.id});

    const edges = vertexEdges.get(state.id);
    if (edges) {
      edges.forEach(recalcEdge);
    }
    return state;
  }

  function recalcEdge(ed: EdgeDef) {
    const edge = getEdge(ed.edgeId);
    const rc = calcEndPoints(edge);
    if (!rc) return;
    updateEdge({...edge, ...rc});
  }

  function calcEndPoints(edge: EdgeState): { x1: number, y1: number, x2: number, y2: number } {
    if (!edge) return;
    const v1 = getVertex(edge.to);
    const v2 = getVertex(edge.from);
    const m1 = rectMidPoint(v1);
    const m2 = rectMidPoint(v2);
    const c1 = clipLine(v1, m1.x, m1.y, m2.x, m2.y);
    const c2 = clipLine(v2, m1.x, m1.y, m2.x, m2.y);
    const x1 = c2.x1;
    const y1 = c2.y1;
    const x2 = c1.x2;
    const y2 = c1.y2;
    if (x1 === edge.x1 && y1 === edge.y1 && x2 === edge.x2 && y2 === edge.y2) return;
    return {x1, y1, x2, y2};
  }

  function removeVertex(id: StateIdType, includeEdges?: boolean): void {
    if (!getVertex(id)) return; // no vertex found
    states.delete(id);
    storeUpdate.fire({type: 'remove-vertex', id: id});

    if (includeEdges) {
      _getConnectedEdges(id).forEach(removeEdge);
    } else { // Set danglers
      _getConnectedEdges(id)
        .map(getEdge)
        .forEach((edgeState) => {
            updateEdge({
              ...edgeState,
              from: edgeState.from === id ? null : edgeState.from,
              to: edgeState.to === id ? null : edgeState.to
            });
          }
        );
    }
  }

  function removeEdge(edgeId: StateIdType): void {
    const state = getEdge(edgeId);
    if (!state) return;
    states.delete(edgeId);
    storeUpdate.fire({type: 'remove-edge', id: edgeId});
    if (state.from) _removeEdge('out', edgeId, state.from, state.to);
    if (state.to) _removeEdge('in', edgeId, state.to, state.from);
  }

  function updateEdges(vertexId: StateIdType, fn: (EdgeState) => EdgeState): EdgeState[] {
    const edges = vertexEdges.get(vertexId);
    if (!edges || edges.length === 0) return <any>_emptyArray;
    const states = edges.map(_getEdgeFromDef).map(fn);
    states.forEach(updateEdge);
    return states;
  }

  function _getConnectedEdges(vertexId: StateIdType): StateIdType[] {
    const edges = vertexEdges.get(vertexId);
    if (!edges || edges.length === 0) return <any> _emptyArray;
    return edges.map((e) => e.edgeId);
  }

  function _getEdgeFromDef(d: EdgeDef): EdgeState {
    return getEdge(d.edgeId);
  }

  function createEdge(origstate: EdgeState): EdgeState {
    const edgeId = origstate.id;
    const curr = getEdge(edgeId);
    if (curr) throw "Edge already exits";
    const state = {...origstate, ...calcEndPoints(origstate)};
    states.set(edgeId, state);
    storeUpdate.fire({type: 'new-edge', id: edgeId});
    _setEdge('out', edgeId, state.from, state.to);
    _setEdge('in', edgeId, state.to, state.from);
    return state;
  }

  function updateEdge(origstate: EdgeState): EdgeState {
    const edgeId = origstate.id;
    const curr = getEdge(edgeId);
    if (!curr) throw "Edge does not exist";
    const state = {...origstate, ...calcEndPoints(origstate)};
    states.set(edgeId, state);
    storeUpdate.fire({type: 'update-edge', id: edgeId});

    if (state.from !== curr.from) _removeEdge('out', edgeId, state.from, state.to);
    if (state.to !== curr.to) _removeEdge('in', edgeId, state.to, state.from);

    _setEdge('out', edgeId, state.from, state.to);
    _setEdge('in', edgeId, state.to, state.from);
    return state;
  }

  function _removeEdge(direction: EdgeDirection, edgeId: StateIdType, vertexId: StateIdType, targetVertexId: StateIdType): void {
    const edges = vertexEdges.get(vertexId);
    if (!edges || edges.length === 0) return;
    const newedges = edges.filter((e) => e.edgeId !== edgeId && e.direction !== direction && e.targetVertexId !== targetVertexId);
    if (newedges.length === edges.length) return;
    if (newedges.length === 0) vertexEdges.delete(vertexId);
    else vertexEdges.set(vertexId, newedges);
  }

  function _setEdge(direction: EdgeDirection, edgeId: StateIdType, vertexId: StateIdType, targetVertexId: StateIdType): void {
    const edges = vertexEdges.get(vertexId);
    if (edges && edges.find((e) => e.edgeId === edgeId && e.direction === direction && e.targetVertexId === targetVertexId)) return; // already exists
    const e = {direction, edgeId, targetVertexId};
    vertexEdges.set(vertexId, edges ? [...edges, e] : [e]);
  }
}
