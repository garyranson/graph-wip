import {AppBus} from "bus/app-bus";
import {StateIdType} from "core/types";
import {WidgetActionClickEvent} from "drag-handlers/types";
import {ModelConstraints} from "modules/constraints";
import {Graph} from "modules/graph";
import {Widget} from "template/widget";
import {CursorManager} from "template/cursor-manager";

export const WidgetSelectionFeatureModule = {
  $type: WidgetSelectionFeature,
  $inject: ['AppBus', 'Graph', 'ModelConstraints','CursorManager'],
  $name: 'WidgetSelectionFeature'
}

function WidgetSelectionFeature(
  appBus: AppBus,
  graph: Graph,
  constraints: ModelConstraints,
  cursorManager: CursorManager
) {
  const selected = new Map<StateIdType, Widget>();

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
    Array.from(selected.keys()).forEach(off);
  }

  function off(id: StateIdType) {
    const w = selected.get(id);
    if (!w) return;
    selected.delete(id);
    cursorManager.releaseLinked('$node-select', w, id);
  }

  function on(id: StateIdType) {
    const w = selected.get(id);
    if (w) return;
    selected.set(
      id,
      cursorManager.createLinked('$node-select', id).removeClass('px-off')
    );
  }

  function toggle(id: StateIdType) {
    if (selected.has(id)) off(id);
    else on(id);
  }
}
