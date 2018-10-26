import {AppBus} from "bus/app-bus";
import {emptyLocator, WidgetLocator} from "modules/widget-locator";
import {DiagramInitEvent} from "bus/diagram-bus";
import {WidgetAttributes} from "core/types";

export const MouseFeatureModule = {
  $type: MouseFeature,
  $inject: ['AppBus','WidgetLocator'],
  $name: 'MouseFeature'
}
function MouseFeature(
  appBus: AppBus,
  finder: WidgetLocator
) {
  function onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    const currentNodeAttributes = ensureOver(e.target as Element);

    appBus.nodeTrigger.fire({
      type: 'mousedown',
      x: e.clientX,
      y: e.clientY,
      element: e.target as Element,
      id: currentNodeAttributes.id,
      action: currentNodeAttributes.action,
      data: currentNodeAttributes.data,
      button: e.button,
      shiftKeys: (e.shiftKey ? 1 : 0) | ((e.altKey || e.metaKey) ? 2 : 0) | (e.ctrlKey ? 4 : 0)
    });
  }

  function mouseClick(e: MouseEvent) {
    e.preventDefault();

    const currentNodeAttributes = ensureOver(e.target as Element);

    appBus.nodeClick.fire({
      type: e.type,
      clickCount: (e.type == 'click') ? 1 : 2,
      x: e.clientX,
      y: e.clientY,
      element: e.target as Element,
      id: currentNodeAttributes.id,
      action: currentNodeAttributes.action,
      data: currentNodeAttributes.data,
      button: e.button,
      shiftKeys: (e.shiftKey ? 1 : 0) | ((e.altKey || e.metaKey) ? 2 : 0) | (e.ctrlKey ? 4 : 0)
    });
  }

  function onMouseEnter(e: MouseEvent): void {
    e.preventDefault();
    ensureOver(e.relatedTarget as Element);
  }

  function onMouseUp(e: MouseEvent): void {
    e.preventDefault();
    ensureOver(e.target as Element);
  }

  function ensureOver(element: Element): WidgetAttributes {
    const attrs = finder(element) || emptyLocator;
    appBus.nodeEnterLeave.fire({enter: attrs.id})
    return attrs;
  }

  function ignoreEvent(e: Event) {
    e.preventDefault();
  }

  let init = appBus.diagramInit.add((e: DiagramInitEvent) => {
    const container = e.container;
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseout", onMouseEnter);
    container.addEventListener("click", mouseClick);
    container.addEventListener("dblclick", mouseClick);
    container.addEventListener("contextmenu", ignoreEvent);
  });

  let destroy = appBus.diagramDestroy.add((e: DiagramInitEvent) => {
    const container = e.container;
    container.removeEventListener("mousedown", onMouseDown);
    container.removeEventListener("mouseup", onMouseUp);
    container.removeEventListener("mouseout", onMouseEnter);
    container.removeEventListener("click", mouseClick);
    container.removeEventListener("dblclick", mouseClick);
    container.removeEventListener("contextmenu", ignoreEvent);

    appBus.diagramDestroy.remove(destroy);
    appBus.diagramInit.remove(init);
  });
}
