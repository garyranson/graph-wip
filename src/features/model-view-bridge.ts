import {AppBus} from "bus/app-bus";
import {StoreBusEvent} from "bus/store-bus";
import {WidgetCanvas} from "modules/widget-canvas";
import {StateIdType} from "core/types";
import {Store} from "modules/store";
import {TreeBuilder} from "features/tree-builder";
import {LayoutManager} from "layout/layout-manager";

export const ModelViewBridgeModule = {
  $type: ModelViewBridge,
  $inject: ['AppBus', 'WidgetCanvas', 'Store', 'TreeBuilder', 'LayoutManager'],
  $name: 'ModelViewBridge'
}

function ModelViewBridge(
  appBus: AppBus,
  canvas: WidgetCanvas,
  store: Store,
  treeBuilder: TreeBuilder,
  layout: LayoutManager
): void {

  const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  let active = false;
  let inprocess = false;
  let createVertex: Set<StateIdType>;
  let createEdge: Set<StateIdType>;
  let removeState: Set<StateIdType>;
  let forceState: Set<StateIdType>;
  let updateEdge: Set<StateIdType>;

  const {applyDeferred, refreshWidget, removeWidget} = canvas;

  initialise();

  appBus.storeUpdate.add((sbe: StoreBusEvent) => {
    switch (sbe.type) {
      case 'new-root' :
      case 'new-vertex' :
      case 'update-vertex' :
        activate();
        if (!createVertex) createVertex = new Set<StateIdType>();
        createVertex.add(sbe.id);

        if (sbe.force) {
          if (!forceState) forceState = new Set<StateIdType>();
          forceState.add(sbe.id);
        }

        return;
      case 'new-edge' :
        activate();
        if (!createEdge) createEdge = new Set<StateIdType>();
        createEdge.add(sbe.id);
        return;
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

    if (createVertex) {
      console.log('resize begin');
      layout(
        treeBuilder(
          Array.from(createVertex),
          (forceState) ? Array.from(forceState) : null
        )
      );
      console.log('resize end');
    }

    inprocess = true;

    try {
      if (createVertex) createVertex.forEach(refreshWidget);
      if (createEdge) createEdge.forEach(refreshWidget);
      if (updateEdge) updateEdge.forEach(refreshWidget);
      if (removeState) removeState.forEach(removeWidget);
      applyDeferred();
    }
    finally {
      initialise();
    }
  }

  function initialise() {
    createVertex = null;
    createEdge = null;
    removeState = null;
    updateEdge = null;
    forceState = null;
    active = false;
    inprocess = false;
  }
}
