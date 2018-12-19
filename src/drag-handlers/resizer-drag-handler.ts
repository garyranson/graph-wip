import {AppBus} from "bus/app-bus";
import {RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragEvent} from "./types";
import {ModelConstraints} from "modules/constraints";
import {ViewController} from "template/view-controller";
import {CursorManager} from "template/cursor-manager";

export const ResizerDragHandlerModule = {
  $inject: ['AppBus', 'ViewController','ModelConstraints','CursorManager'],
  $name: 'ResizerDragHandler',
  $item: 'resizer',
  $type: ResizerDragHandler
}

function ResizerDragHandler(appBus: AppBus, canvas: ViewController,constraints: ModelConstraints, cursorManager: CursorManager): DragHandlerFactory {

  interface MoverFunction {
    (e: WidgetDragEvent): RectangleLike;
  }

  return (state: State, actionData: string, x: number, y: number) => {
    return createResizer(state as VertexState, actionData);
  }

  function createResizer(vertex: VertexState, position: string): DragHandler {
    const mover = moveFn(position.toLowerCase());
    const widget = cursorManager.create('$shape-resize').refresh(vertex).removeClass('px-off');
    const {x, y, width, height} = vertex;
    const minSize = constraints.getMinSize(vertex);
    const maxSize = constraints.getMaxSize(vertex);

    return {move, drop, cancel}

    function move(e: WidgetDragEvent) {
      widget.refresh(mover(e));
    }

    function drop(e: WidgetDragEvent) {
      appBus.resizeNode.fire({
        id: vertex.id,
        eventType: 'resize',
        bounds: mover(e) //shadow.getBounds()
      });
      cancel();
    }

    function cancel() {
      cursorManager.release('$shape-resize',widget);
    }

    function moveFn(position: string): MoverFunction {
      return position === 'br'
        ? moveBR
        : position === 'tr'
          ? moveTR
          : position === 'tl'
            ? moveTL
            : position === 'bl'
              ? moveBL
              : noop as MoverFunction;
    }

    function moveBR(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width + e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height + e.dy, minSize.height), maxSize.height) - height);
      return {x, y, width: width + dx, height: height + dy};
    }

    function moveTR(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width + e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height - e.dy, minSize.height), maxSize.height) - height);
      return {x, y: y - dy, width: width + dx, height: height + dy};
    }

    function moveTL(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width - e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height - e.dy, minSize.height), maxSize.height) - height);
      return {x: x - dx, y: y - dy, width: width + dx, height: height + dy};
    }

    function moveBL(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width - e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height + e.dy, minSize.height), maxSize.height) - height);
      return {x: x - dx, y, width: width + dx, height: height + dy};
    }
  }
}

function noop(): any {
}
