import {AppBus} from "bus/app-bus";
import {RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragEvent} from "./types";
import {ViewController} from "template/view-controller";

export const LassoDragHandlerModule = {
  $inject: ['AppBus', 'ViewController'],
  $name: 'LassoDragHandler',
  $item: 'lasso',
  $type: LassoDragHandler
}

function LassoDragHandler(appBus: AppBus, canvas: ViewController): DragHandlerFactory {

  return (state: State, actionData: string, x: number, y: number) => {
    return createLasso(
      {...state, width: 0, height: 0} as VertexState,
      x,
      y
    );
  }

  function createLasso(vertex: VertexState, x: number, y: number): DragHandler {
    const widget = canvas.createToolWidget('$lasso', vertex);

    return {move, drop, cancel}

    function move(e: WidgetDragEvent): void {
      widget.refresh(_move(e.dx, e.dy));
    }

    function _move(dx: number, dy: number): RectangleLike {
      if (dx > 0 && dy > 0) {
        return {x, y, width: dx, height: dy}
      }
      if (dx > 0 && dy < 0) {
        return {x, y: y + dy, width: dx, height: -dy}
      }
      if (dx < 0 && dy < 0) {
        return {x: x + dx, y: y + dy, width: -dx, height: -dy};
      }
      if (dx < 0 && dy > 0) {
        return {x: x + dx, y, width: -dx, height: dy};
      } else {
        return {x, y, width: 0, height: 0};
      }
    }

    function drop(e: WidgetDragEvent) {
      appBus.selectNode.fire({bounds: _move(e.dx,e.dy)});
      cancel();
    }

    function cancel() {
      widget.remove();
    }
  }
}
