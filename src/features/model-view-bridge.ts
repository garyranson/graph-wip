import {AppBus} from "bus/app-bus";
import {StoreBusEvent} from "bus/store-bus";
import {WidgetCanvas} from "modules/widget-canvas";
import {StateIdType} from "core/types";

export const ModelViewBridgeModule = {
  $type: ModelViewBridge,
  $inject: ['AppBus', 'WidgetCanvas'],
  $name: 'ModelViewBridge'
}

function ModelViewBridge(appBus: AppBus, canvas: WidgetCanvas): void {

  const raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
  let active = false;
  let inprocess = false;
  let createVertex: Set<StateIdType>;
  let createEdge: Set<StateIdType>;
  let removeState: Set<StateIdType>;
  let updateState: Set<StateIdType>;

  const {applyDeferred, createWidget, refreshWidget, removeWidget} = canvas;

  initialise();

  appBus.storeUpdate.add((sbe: StoreBusEvent) => {
    switch (sbe.type) {
      case 'new-vertex' :
        activate();
        if (!createVertex) createVertex = new Set<StateIdType>();
        createVertex.add(sbe.id);
        return;
      case 'new-edge' :
        activate();
        if (!createEdge) createEdge = new Set<StateIdType>();
        createEdge.add(sbe.id);
        return;
      case 'update-vertex' :
      case 'update-edge' :
        activate();
        if (!updateState) updateState = new Set<StateIdType>();
        updateState.add(sbe.id);
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
    inprocess = true;
    try {
      if (createVertex) createVertex.forEach(createWidget);
      if (createEdge) createEdge.forEach(createWidget);
      if (updateState) updateState.forEach(refreshWidget);
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
    updateState = null;
    active = false;
    inprocess = false;
  }

}
