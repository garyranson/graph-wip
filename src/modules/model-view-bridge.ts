import {AppBus} from "bus/app-bus";
import {StoreBusEvent} from "bus/store-bus";
import {ViewController} from "template/view-controller";
import {StateIdType} from "core/types";
import {Graph} from "modules/graph";
import {TreeBuilder} from "features/tree-builder";
import {LayoutManager} from "layout/layout-manager";

export const ModelViewBridgeModule = {
  $type: ModelViewBridge,
  $inject: ['AppBus', 'ViewController', 'Graph', 'TreeBuilder', 'LayoutManager'],
  $name: 'ModelViewBridge'
}

function ModelViewBridge(
  appBus: AppBus,
  canvas: ViewController,
  graph: Graph,
  treeBuilder: TreeBuilder,
  layout: LayoutManager
): void {

  const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  let active = false;
  let inprocess = false;
  let updateVertex: Set<StateIdType>;
  let updateEdge: Set<StateIdType>;
  let removeState: Set<StateIdType>;
  let forceState: Set<StateIdType>;

  const {applyDeferred, refreshVertexWidget, refreshEdgeWidget, removeWidget} = canvas;

  initialise();

  appBus.storeUpdate.add((sbe: StoreBusEvent) => {
    switch (sbe.type) {
      case 'new-root' :
        canvas.createRoot(graph.getVertex(sbe.id));
        return;
      case 'new-vertex' :
      case 'update-vertex' :
        activate();
        if (!updateVertex) updateVertex = new Set<StateIdType>();
        updateVertex.add(sbe.id);

        if (sbe.force) {
          if (!forceState) forceState = new Set<StateIdType>();
          forceState.add(sbe.id);
        }

        return;
      case 'new-edge' :
      case 'update-edge' :
        activate();
        if (!updateEdge) updateEdge = new Set<StateIdType>();
        updateEdge.add(sbe.id);
        return;
      case 'remove-vertex' :
      case 'remove-edge' :
        activate()
        if (!removeState) removeState = new Set<StateIdType>();
        removeState.add(sbe.id);
        return;
    }
  });

  function activate(): void {
    if (inprocess) throw 'ERROR: In refresh cycle';
    if (active) return;
    raf(fire);
    active = true;
  }

  function fire() {

    if (updateVertex) {
      console.log('bulding refresh tree');
      layout(
        treeBuilder(
          Array.from(updateVertex),
          (forceState) ? Array.from(forceState) : null
        )
      );
    }

    inprocess = true;
console.log('refreshing compoents');
    try {
      if (updateVertex) updateVertex.forEach((w) => console.log(`model:${JSON.stringify(w)}`));
      if (updateVertex) updateVertex.forEach(_refreshVertexWidget);
      if (updateEdge) updateEdge.forEach(_refreshEdgeWidget);
      if (removeState) removeState.forEach(removeWidget);
      applyDeferred();
    }
    finally {
      console.log('....component refresh complete pre init');
      initialise();
      console.log('....component refresh complete post init');
    }
  }

  function _refreshVertexWidget(id: string) {
    refreshVertexWidget(graph.getState(id));
  }
  function _refreshEdgeWidget(id: string) {
    refreshEdgeWidget(graph.getState(id));
  }


  function initialise() {
    updateVertex = null;
    removeState = null;
    updateEdge = null;
    forceState = null;
    active = false;
    inprocess = false;
  }
}
