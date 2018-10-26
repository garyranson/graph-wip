import {AppBus} from "bus/app-bus";
import {emptyLocator, WidgetLocator} from "modules/widget-locator";
import {SvgHelpers} from "modules/svg-helpers";
import {DragHandlers} from "drag-handlers/drag-handlers";
import {Store} from "modules/store";
import {DragHandler, WidgetActionEvent, WidgetDragEvent} from "drag-handlers/types";

export const MouseDragFeatureModule = {
  $type: MouseDragFeature,
  $inject: ['AppBus', 'WidgetLocator', 'SvgHelpers', 'DragHandlers', 'Store'],
  $name: 'MouseDragFeature'
}
function MouseDragFeature(
  appBus: AppBus,
  finder: WidgetLocator,
  svg: SvgHelpers,
  dragHandlers: DragHandlers,
  store: Store
) {
  let eventData: WidgetActionEvent;
  let currentNodeAttributes = emptyLocator;
  let dragHandler : DragHandler = null;

  const dragStart = appBus.mouseDragRequest.add((e: WidgetActionEvent) => {
    currentNodeAttributes = emptyLocator;
    const state = store.getState(e.id);
    if (!state) return;
    const f = dragHandlers.getFactory(e.action);
    dragHandler = f(state,e.data, e.x,e.y);
    eventData = e;
    activateImmediate();
    appBus.nodeEnterLeave.fire(); // Removes hightlights
    e && e.element && ensureOver(e.element);
  });

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.mouseDragRequest.remove(dragStart);
  });

  function onMouseMove(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    const ed = createEventData(e);
    dragHandler.move(ed);
  }

  function onMouseUp(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;
    ensureOver(e.relatedTarget as Element);
    const ed = {...createEventData(e),id:currentNodeAttributes.id};
    dragHandler.drop(ed);
    appBus.mouseDragComplete.fire(ed);
    deactivateImmediate();
  }

  function onMouseOut(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    ensureOver(e.relatedTarget as Element);
    if(dragHandler.over) dragHandler.over({...createEventData(e),id:currentNodeAttributes.id});
    //Determine if we're over a dropable object
  }

  function ensureOver(element: Element): void {
    if (!element) return;
    const attrs = finder(element) || emptyLocator;
    currentNodeAttributes = attrs;
  }

  function onKeyDown(e: KeyboardEvent) {
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.code !== 'Escape') return;
    dragHandler.cancel();
    appBus.mouseDragComplete.fire();
    deactivateImmediate();
  }

  function mouseClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function activateImmediate() {
    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseout", onMouseOut, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);

    document.addEventListener("click",mouseClick,true);
    document.addEventListener("dblclick",mouseClick,true);
    document.addEventListener("mousedown",mouseClick,true);
  }

  function deactivateImmediate() {
    document.removeEventListener("mouseup", onMouseUp, true);
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("mouseout", onMouseOut, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("keyup", onKeyUp, true);
    document.removeEventListener("click",mouseClick,true);
    document.removeEventListener("dblclick",mouseClick,true);
    document.removeEventListener("mousedown",mouseClick,true);
  }

  function createEventData(e: MouseEvent): WidgetDragEvent {

    const mpt = svg.pointAt(e.clientX, e.clientY);

    return {
      x: mpt.x,
      y: mpt.y,
      dx: e.clientX - eventData.x,
      dy: e.clientY - eventData.y
    }
  }
}
