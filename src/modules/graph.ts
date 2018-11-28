import {EdgeState, RectangleLike, State, StateIdType, VertexMove, VertexState} from "core/types";
import {AppBus} from "bus/app-bus";
import {clipLine} from "core/scalaclip";
import {lineFromPoints, rectMidPoint} from "core/geometry";

export interface Graph {
  getEdge(id: StateIdType): EdgeState;

  updateEdge(edge: EdgeState): EdgeState;

  createEdge(edge: EdgeState): EdgeState;

  removeEdge(id: StateIdType): void;

  updateEdges(vertexId: StateIdType, fn: (EdgeState) => EdgeState): EdgeState[];

  getVertex(id: StateIdType): VertexState;

  getChildVertices(id: StateIdType): VertexState[];

  updateVertex(edge: VertexState, index?: VertexMove): VertexState;

  createVertex(edge: VertexState): VertexState;

  createRoot(edge: VertexState): VertexState;

  removeVertex(id: StateIdType): void;

  getState<T extends State>(id: StateIdType): T;

  getParentId(id: StateIdType): StateIdType;

  getRootId(): StateIdType;

  getCanvasBounds(id: StateIdType): RectangleLike;
}

export const StoreModule = {
  $type: Graph,
  $inject: ['AppBus'],
  $name: 'Graph'
}
const _emptyArray = Object.freeze([]);

type EdgeDirection = "in" | "out";

function Graph(appBus: AppBus): Graph {

  const emptySet = [];
  const {storeUpdate} = appBus;

  interface EdgeDef {
    direction: EdgeDirection;
    edgeId: StateIdType;
    targetVertexId: StateIdType;
  }

  const states = new Map<StateIdType, State>();
  const vertexEdges = new Map<StateIdType, EdgeDef[]>();

  const childVertices = new Map<StateIdType, StateIdType[]>();

  let rootId: StateIdType = null;

  appBus.diagramResize.add(() => {
    storeUpdate.fire({type: 'update-vertex', id: rootId, force: true});
  });

  return {
    getVertex,
    createVertex,
    createRoot,
    updateVertex,
    removeVertex,
    getEdge,
    createEdge,
    updateEdge,
    removeEdge,
    updateEdges,
    getChildVertices,
    getState,
    getParentId,
    getRootId,
    getCanvasBounds,
  }

  function getCanvasBounds(id: StateIdType): RectangleLike {
    let s = getVertex(id);
    if (!s) return {x: 0, y: 0, width: 0, height: 0};
    let x = 0;
    let y = 0;
    let w = s.width;
    let h = s.height;

    while (s.parent) {
      x += s.x;
      y += s.y;
      s = getVertex(s.parent);
    }
    return {x, y, width: w, height: h};
  }

  function getRootId(): StateIdType {
    return rootId;
  }

  function getState<T extends State>(id): T {
    return states.get(id) as T;
  }

  function getParentId(id: StateIdType): StateIdType {
    const s = states.get(id) as VertexState;
    return s.parent;
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

  function createRoot(state: VertexState): VertexState {
    if (rootId) throw 'rootAlreadySet';
    rootId = state.id;
    if (getVertex(state.id)) throw "State already exists";
    states.set(state.id, state);
    storeUpdate.fire({type: 'new-root', id: state.id});
    return state;
  }

  function createVertex(state: VertexState): VertexState {
    if (getVertex(state.id)) throw "State already exists";
    states.set(state.id, state);
    if (!state.parent) throw 'no parent';
    let cv = childVertices.get(state.parent);
    if (!cv) {
      cv = [];
      childVertices.set(state.parent, cv);
    }
    cv.push(state.id);
    storeUpdate.fire({type: 'new-vertex', id: state.id});
    return state;
  }

  function updateVertex(state: VertexState, move?: VertexMove): VertexState {
    const id = state.id;
    const existingState = getVertex(id);
    if (!existingState) throw "State does not exist";

    states.set(id, state);

    if (state.parent !== existingState.parent)
      _changeParent(id, existingState.parent, state.parent, move);
    else if (move && move.id !== id) {
      _reorderChild(id, state.parent, move);
    }

    storeUpdate.fire({type: 'update-vertex', id, force: hasChildren(id)});

    const edges = vertexEdges.get(id);
    if (edges && edges.length) edges.forEach(recalcEdge);
    return state;
  }

  function _reorderChild(id: StateIdType, parent: StateIdType, move: VertexMove) {
    if (id === move.id) return; // no change
    const children = childVertices.get(parent);
    if (!children) return; // should not happen
    const newlist = _move(children,id,move);
    if (!newlist || newlist === children)      return;
    childVertices.set(parent, newlist);
    storeUpdate.fire({type: 'update-vertex', id: parent, force: true});
  }

  function _move(children: StateIdType[], id: StateIdType, move: VertexMove): StateIdType[] {
    const s = children.filter((e) => e !== id);
    const p = children.indexOf(move.id);

    switch (move.action) {
      case 'end':
        if (children[children.length - 1] === id) return children;
        s.splice(children.length,0,id);
        return s;
      case 'start':
        if (children[0] === id) return children;
        s.splice(0, 0, id);
        return s;
      case 'after':
        if (children[p+1] === id) return children;
        s.splice(p+1, 0, id);
        return s;
      case 'before':
        if (children[p - 1] === id) return children;
        s.splice(p, 0, id);
        return s;
      default:
        return children;
    }
  }

  function _changeParent(child: StateIdType, from: StateIdType, to: StateIdType, move: VertexMove) {
    if (from === to) return;
    const ev = childVertices.get(from);
    const ev2 = ev.filter((e) => e !== child);

    if (ev2.length)
      childVertices.set(from, ev2);
    else
      childVertices.delete(from);

    let nv = childVertices.get(to) || [];
    childVertices.set(to, _move(nv, child, move?move:{action:'end'}));
    //TODO: Need to account for change in parent, but where the parent has not changed x,y
    //in these cases, we want to translate the x,y position from the old coord into the new coord
    storeUpdate.fire({type: 'update-vertex', id: from, force: true});
    storeUpdate.fire({type: 'update-vertex', id: to, force: true});
  }

  function hasChildren(id: StateIdType): boolean {
    const s = childVertices.get(id);
    return s && s.length ? true : false;
  }

  function recalcEdge(ed: EdgeDef) {
    const edge = getEdge(ed.edgeId);
    const rc = calcEndPoints(edge);
    if (!rc) return;
    updateEdge({...edge, ...rc});
  }

  function calcEndPoints(edge: EdgeState): { x1: number, y1: number, x2: number, y2: number } {
    if (!edge) return;
    const v1 = getCanvasBounds(edge.to); //getVertex(edge.to);
    const v2 = getCanvasBounds(edge.from); //getVertex(edge.from);
    const ll = lineFromPoints(rectMidPoint(v2), rectMidPoint(v1));
    const {x1, y1} = clipLine(v2, ll);
    const {x2, y2} = clipLine(v1, ll);
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
    if (!edges || edges.length === 0) return <any>_emptyArray;
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

  function getChildVertexIds(id: StateIdType): StateIdType[] {
    return childVertices.get(id) || emptySet;
  }

  function getChildVertices(id: StateIdType): VertexState[] {
    return getChildVertexIds(id).map(getVertex);
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
