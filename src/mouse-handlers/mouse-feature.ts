import {AppBus} from "bus/app-bus";
import {emptyLocator, WidgetLocator} from "modules/widget-locator";
import {DiagramInitEvent} from "bus/diagram-bus";
import {WidgetAttributes} from "core/types";
import {Store} from "modules/store";
import {WidgetCanvas} from "modules/widget-canvas";

export const MouseFeatureModule = {
  $type: MouseFeature,
  $inject: ['AppBus','WidgetLocator','Store','WidgetCanvas'],
  $name: 'MouseFeature'
}
function MouseFeature(
  appBus: AppBus,
  finder: WidgetLocator,
  store: Store,
  canvas: WidgetCanvas
) {
  let el : Element;
  /*function onPointerDown(e: PointerEvent) : void {
   // e.preventDefault();
    console.log(`type:${e.type} ${e.pointerType} press:${e.pressure}  id:${e.pointerId}`);
    el.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: PointerEvent) : void {
    e.preventDefault();
    console.log(`type:${e.type} ${e.pointerType} press:${e.pressure}`);
  }
  function onPointerUp(e: PointerEvent) : void {
    e.preventDefault();
    console.log(`type:${e.type} ${e.pointerType} press:${e.pressure}`);
    el.releasePointerCapture(e.pointerId);
  }
*/

  function onMouseDown(e: MouseEvent): void {
    e.preventDefault();

    const currentNodeAttributes = ensureOver(e.target as Element);
    const mpt = canvas.pointAt(e.clientX, e.clientY);

    appBus.nodeTrigger.fire({
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

    appBus.nodeClick.fire({
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
    appBus.nodeEnterLeave.fire({enter: attrs.id})
    return attrs;
  }

  function ignoreEvent(e: Event) {
    e.preventDefault();
  }

  let init = appBus.diagramInit.add((e: DiagramInitEvent) => {
    const container = e.container;
    el = container;
/*
    container.addEventListener("pointerdown", onPointerDown);
    container.addEventListener("pointermove", onPointerMove);
    container.addEventListener("pointerup", onPointerUp);
*/
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
