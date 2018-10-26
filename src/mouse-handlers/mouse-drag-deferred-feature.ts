import {AppBus} from "bus/app-bus";
import {WidgetActionEvent} from "drag-handlers/types";

export const MouseDragDeferredFeatureModule = {
  $type: mouseDragDeferredFeature,
  $inject: ['AppBus']
}

export function mouseDragDeferredFeature(appBus: AppBus) {
  let eventData: WidgetActionEvent;

  const dragDefer = appBus.mouseDragDefer.add((e: WidgetActionEvent) => {
    eventData = Object.freeze({...e});
    document.addEventListener('mouseup', deactivate, true);
    document.addEventListener('mousemove', mouseMove, true);
  });

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.mouseDragDefer.remove(dragDefer);
  });

  function deactivate() {
    document.removeEventListener('mouseup', deactivate, true);
    document.removeEventListener('mousemove', mouseMove, true);
  }

  function mouseMove(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (Math.abs(e.clientX - eventData.x) <= 5 && Math.abs(e.clientY - eventData.y) <= 5)
      return;

    deactivate();
    appBus.mouseDragRequest.fire(eventData);
    eventData = null;
  }
}
