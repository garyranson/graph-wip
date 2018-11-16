import {AppBus} from "bus/app-bus";
import {WidgetCanvas} from "modules/widget-canvas";
import {DragHandlers} from "drag-handlers/drag-handlers";
import {WidgetActionEvent} from "drag-handlers/types";

export const NodeActionFeatureModule = {
  $inject: ['AppBus', 'WidgetCanvas', 'DragHandlers'],
  $name: 'WidgetActionFeature',
  $type: WidgetActionFeature,
}

function WidgetActionFeature(
  appBus: AppBus,
  canvas: WidgetCanvas,
  dragHandlers: DragHandlers,
) {

  const elementMouseDown = appBus.nodeTrigger.add((nat: WidgetActionEvent) => {
    if (nat.button !== 0 || nat.shiftKeys!==0) return;

    switch (dragHandlers.getAction(nat.action)) {
      case "deffered":
        appBus.mouseDragDefer.fire(nat);
        return;
      case "immediate":
        appBus.mouseDragRequest.fire(nat);
        return;
    }
  });

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.nodeTrigger.remove(elementMouseDown);
  });
}
