import {AppBus} from "bus/app-bus";
import {StateIdType} from "core/types";
import {WidgetActionClickEvent} from "drag-handlers/types";
import {ModelConstraints} from "modules/constraints";
import {Graph} from "modules/graph";

export const WidgetSelectionFeatureModule = {
  $type: WidgetSelectionFeature,
  $inject: ['AppBus', 'Graph', 'ModelConstraints'],
  $name: 'WidgetSelectionFeature'
}

function WidgetSelectionFeature(
  appBus: AppBus,
  graph: Graph,
  constraints: ModelConstraints,
) {
  const selected = new Set<StateIdType>();

  let nodeClick = appBus.widgetClick.add((e: WidgetActionClickEvent) => {

    if (!e) {
      clear();
      return;
    }

    if (e.button !== 0 || !constraints.isSelectable(e.id)) return;

    switch (e.shiftKeys) {
      case 0 :
        clear();
        on(e.id);
        return;
      case 4 :
        toggle(e.id);
        return;
    }
  });

  let destroy = appBus.diagramDestroy.add((e) => {
    appBus.widgetClick.remove(nodeClick);
    appBus.diagramDestroy.remove(destroy);
  });

  function clear(): void {
    Array.from(selected).forEach(off);
  }

  function off(id: StateIdType) {
    if (!selected.has(id)) return;
    selected.delete(id);
    fire(id, 'off');
  }

  function on(id: StateIdType) {
    if (selected.has(id)) return;
    selected.add(id);
    fire(id, 'on');
  }

  function toggle(id: StateIdType) {
    if (selected.has(id)) off(id);
    else on(id);
  }

  function fire(id: StateIdType, selectionState: "on" | "off") {
    appBus.widgetSelection.fire({
      type: 'selection',
      id,
      bounds: graph.getCanvasBounds(id),
      selectionState
    })
  }
}
