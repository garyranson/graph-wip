import {AppBus} from "bus/app-bus";
import {DragHandlers} from "drag-handlers/drag-handlers";
import {WidgetActionEvent} from "drag-handlers/types";

export const NodeActionFeatureModule = {
  $inject: ['AppBus', 'DragHandlers'],
  $name: 'WidgetActionFeature',
  $type: WidgetActionFeature,
}

function WidgetActionFeature(
  appBus: AppBus,
  dragHandlers: DragHandlers,
) {

  const elementMouseDown = appBus.widgetActionTrigger.add((nat: WidgetActionEvent) => {
    if (nat.button !== 0 || nat.shiftKeys!==0) return;

    switch (dragHandlers.getAction(nat.action)) {
      case "deffered":
        appBus.widgetDragDefer.fire(nat);
        return true;
      case "immediate":
        appBus.widgetDragRequest.fire(nat);
        return true;
    }
  });

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.widgetActionTrigger.remove(elementMouseDown);
  });
}
