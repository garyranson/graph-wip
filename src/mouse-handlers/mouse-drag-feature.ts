import {AppBus} from "bus/app-bus";
import {emptyLocator, WidgetLocator} from "modules/widget-locator";
import {DragHandlers} from "drag-handlers/drag-handlers";
import {Store} from "modules/store";
import {DragHandler, WidgetActionEvent, WidgetDragEvent} from "drag-handlers/types";
import {ModelController} from "modules/model-controller";
import {WidgetCanvas} from "modules/widget-canvas";
import {Container} from "modules/container-initialiser";

interface Cursor {
  (string?) :void;
}

export const MouseDragFeatureModule = {
  $type: MouseDragFeature,
  $inject: ['AppBus', 'WidgetLocator', 'WidgetCanvas', 'DragHandlers', 'Store', 'ModelController', 'Container'],
  $name: 'MouseDragFeature'
}

function MouseDragFeature(
  appBus: AppBus,
  finder: WidgetLocator,
  canvas: WidgetCanvas,
  dragHandlers: DragHandlers,
  store: Store,
  model: ModelController,
  containerO: Container
) {
  let eventData: WidgetActionEvent;
  const container = containerO.get();
  let currentNodeAttributes = emptyLocator;
  let dragHandler: DragHandler = null;
  let dragMagic: DragMagic;
  let cursor : Cursor;

  const dragStart = appBus.mouseDragRequest.add((e: WidgetActionEvent) => {
    currentNodeAttributes = emptyLocator;
    const state = store.getState(e.id);
    if (!state) return;
    const f = dragHandlers.getFactory(e.action);
    dragHandler = f(state, e.data, e.x, e.y);
    eventData = e;
    activateImmediate();
    appBus.nodeEnterLeave.fire(); // Removes hightlights
    e && e.element && ensureOver(e.element);
    cursor = Cursor(container,"px-drag-over");
  });

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.mouseDragRequest.remove(dragStart);
  });

  function onMouseMove(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (dragMagic) dragMagic.move(e);
    dragHandler.move(createEventData(e));
  }

  function onMouseUp(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    if (e.button !== 0) return;
    ensureOver(e.target as Element);
    dragHandler.drop(createEventData(e));
    deactivateImmediate();
  }

  function onMouseOut(e: MouseEvent): void {
    e.preventDefault();
    e.stopPropagation();
    ensureOver(e.relatedTarget as Element);
    if (dragHandler.over) {
      const feedback = dragHandler.over(createEventData(e));
      feedback && cursor(feedback);
    }
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
    deactivateImmediate();
  }

  function mouseClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  function mouseLeave(e: MouseEvent) {
    dragMagic = DragMagic(container);
  }

  function mouseEnter(e: MouseEvent) {
    if (dragMagic) dragMagic.release();
    dragMagic = null;
  }

  function activateImmediate() {
    eventData.source.addEventListener('mouseenter', mouseEnter);
    eventData.source.addEventListener('mouseleave', mouseLeave);

    document.body.classList.add('px-cursor-override');


    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseout", onMouseOut, true);
    document.addEventListener("keydown", onKeyDown, true);
    document.addEventListener("keyup", onKeyUp, true);

    document.addEventListener("click", mouseClick, true);
    document.addEventListener("dblclick", mouseClick, true);
    document.addEventListener("mousedown", mouseClick, true);
  }

  function deactivateImmediate() {
    cursor(null);
    document.body.classList.remove('px-cursor-override');
    document.removeEventListener("mouseup", onMouseUp, true);
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("mouseout", onMouseOut, true);
    document.removeEventListener("keydown", onKeyDown, true);
    document.removeEventListener("keyup", onKeyUp, true);
    document.removeEventListener("click", mouseClick, true);
    document.removeEventListener("dblclick", mouseClick, true);
    document.removeEventListener("mousedown", mouseClick, true);

    eventData.source.removeEventListener('mouseenter', mouseEnter);
    eventData.source.removeEventListener('mouseleave', mouseLeave);
  }

  function createEventData(e: MouseEvent): WidgetDragEvent {
    const mpt = canvas.pointAt(e.clientX, e.clientY);
    const vo = model.getVertexCanvasBounds(currentNodeAttributes.id);
    return {
      id: currentNodeAttributes.id,
      x: mpt.x - vo.x,
      y: mpt.y - vo.y,
      dx: mpt.x - eventData.x,
      dy: mpt.y - eventData.y,
      canvasX: mpt.x,
      canvasY: mpt.y,
    };
  }
}

interface DragMagic {
  release(): void;

  move(MouseEvent): void;
}

function DragMagic(container: Element): DragMagic {
  const timer = setInterval(tick, 200);
  const bb = container.getBoundingClientRect();

  return {
    release() {
      clearInterval(timer);
    },
    move(e: MouseEvent) {
      container.scrollTop += (e.clientY < bb.top) ? -4 : (e.clientY > bb.bottom) ? 4 : 0;
      container.scrollLeft += (e.clientX < bb.left) ? -4 : (e.clientX > bb.right) ? 4 : 0;
    }
  }

  function tick() {
    // console.log('tick');
  }
}


function Cursor(element: Element, start: string) {
  const el = element.ownerDocument.body;
  let current: string;

  set(start);
  return set;
  function set(value: string) {
    if (value !== current) {
      if (current) el.classList.remove(current);
      current = value;
      if (current) el.classList.add(current);
    }
  }
}
