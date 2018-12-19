import {AppBus} from "bus/app-bus";
import {emptyLocator, WidgetLocator} from "template/widget-locator";
import {DiagramInitEvent} from "bus/diagram-bus";
import {WidgetAttributes} from "core/types";
import {ViewController} from "template/view-controller";

export const PointerFeatureModule = {
  $type: PointerFeature,
  $inject: ['AppBus','WidgetLocator','ViewController'],
  $name: 'MouseFeature'
}
function PointerFeature(
  appBus: AppBus,
  finder: WidgetLocator,
  canvas: ViewController
) {
  let el : Element;

  function onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    const currentNodeAttributes = ensureOver(e.target as Element);
    const mpt = canvas.pointAt(e.clientX, e.clientY);

    appBus.widgetActionTrigger.fire({
      type: 'mousedown',
      x: mpt.x,
      y: mpt.y,
      element: e.target as Element,
      id: currentNodeAttributes.id,
      action: currentNodeAttributes.action,
      data: currentNodeAttributes.data,
      button: e.button,
      shiftKeys: (e.shiftKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.ctrlKey || e.metaKey ? 4 : 0),
      source: el,
    });
  }

  function mouseClick(e: MouseEvent) {
   e.preventDefault();

    const currentNodeAttributes = ensureOver(e.target as Element);

    const mpt = canvas.pointAt(e.clientX, e.clientY);

    appBus.widgetClick.fire({
      type: e.type,
      clickCount: (e.type == 'click') ? 1 : 2,
      x: mpt.x,
      y: mpt.y,
      element: e.target as Element,
      id: currentNodeAttributes.id,
      action: currentNodeAttributes.action,
      data: currentNodeAttributes.data,
      button: e.button,
      shiftKeys: (e.shiftKey ? 1 : 0) | (e.altKey ? 2 : 0) | (e.ctrlKey || e.metaKey ? 4 : 0),
      source: el
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
    console.log('enterleave:'+attrs.id);
    appBus.widgetEnterLeave.fire({enter: attrs.id})
    return attrs;
  }

  function ignoreEvent(e: Event) {
    e.preventDefault();
  }

  let init = appBus.diagramInit.add((e: DiagramInitEvent) => {
    const container = e.container;
    el = container;
    container.addEventListener("pointerdown", onMouseDown);
    container.addEventListener("pointerup", onMouseUp);
    container.addEventListener("pointerout", onMouseEnter);
    container.addEventListener("click", mouseClick);
    container.addEventListener("dblclick", mouseClick);
    container.addEventListener("contextmenu", ignoreEvent);
  });

  let destroy = appBus.diagramDestroy.add((e: DiagramInitEvent) => {
    const container = e.container;
    container.removeEventListener("pointerdown", onMouseDown);
    container.removeEventListener("pointerup", onMouseUp);
    container.removeEventListener("pointerout", onMouseEnter);
    container.removeEventListener("click", mouseClick);
    container.removeEventListener("dblclick", mouseClick);
    container.removeEventListener("contextmenu", ignoreEvent);

    appBus.diagramDestroy.remove(destroy);
    appBus.diagramInit.remove(init);
  });
}
