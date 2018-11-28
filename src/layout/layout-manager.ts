import {SizeLike, StateIdType, VertexState} from "core/types";
import {LayoutLeaf} from "features/tree-builder";
import {Graph} from "modules/graph";
import {flowLayout} from "layout/flow-layout";
import {fillLayout} from "layout/fill-layout";

export const LayoutManagerModule = {
  $type: LayoutManager,
  $inject: ['Graph'],
  $name: 'LayoutManager'
}

export interface LayoutManager {
  (root: LayoutLeaf): void;
}

export interface LayoutFunction {
  (graph: Graph, container: VertexState, children: VertexState[]): SizeLike
}

function LayoutManager(store: Graph) : LayoutManager {

  return function layoutManager(root: LayoutLeaf): void {
    walkit(root);
    if (root.layout) layitout(root.id);
  }

  function walkit(parent: LayoutLeaf): void {
    for (const l of parent.children) {
      walkit(l);
      if (l.layout && layitout(l.id) === true) {
        parent.layout = true;
      }
    }
  }

  function layitout(id: StateIdType): any {
    const lmgr = getLayout(id);
    if (!lmgr) return;
    const container = store.getVertex(id);
    const sz = lmgr(store, container, store.getChildVertices(id));
    if (sz && (sz.width !== container.width || sz.height !== container.height)) {
      store.updateVertex({...container, width: sz.width, height: sz.height});
      return true;
    }
  }

  function getLayout(id: StateIdType): LayoutFunction {
    return id == store.getRootId()
      ? fillLayout
      : flowLayout;
  }
}
