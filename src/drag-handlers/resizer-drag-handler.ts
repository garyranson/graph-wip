import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "modules/shadow-widget-factory";
import {RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragEvent} from "./types";

export const ResizerDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory'],
  $name: 'ResizerDragHandler',
  $item: 'resizer',
  $type: ResizerDragHandler
}

function ResizerDragHandler(appBus: AppBus, shadowFactory: ShadowWidgetFactory): DragHandlerFactory {

  return (state: State, actionData: string, x: number, y: number) => {
    return createResizer(state as VertexState, actionData);
  }

  function createResizer(vertex: VertexState, position: string): DragHandler {
    let shadow = shadowFactory.create(vertex, '$shape-resize', 'tool');
    const {x, y, width, height} = vertex;
    const minSize = vertex.$type.minumumSize;
    const maxSize = vertex.$type.maximumSize;

    return {move, drop, cancel}

    function move(e: WidgetDragEvent) {
      const dx = Math.round(Math.min(Math.max(width + e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height + e.dy, minSize.height), maxSize.height) - height);
      if (dx === 0 && dy === 0) return;

      shadow.update(getMove(dx, dy));
    }

    function getMove(dx: number, dy: number): RectangleLike {
      return position === 'br'
        ? {x, y, width: width + dx, height: height + dy}
        : position === 'tr'
          ? {x, y: y + dy, width: width + dx, height: height - dy}
          : position === 'tl'
            ? {x: x + dx, y: y + dy, width: width - dx, height: height - dy}
            : position === 'bl' ? {x: x + dx, y, width: width - dx, height: height + dy}
              : {x, y, width, height};
    }

    function drop(e: WidgetDragEvent) {
      appBus.resizeNode.fire({
        id: vertex.id,
        eventType: 'resize',
        bounds: shadow.getBounds()
      });
      cancel();
    }

    function cancel() {
      if (!shadow) return;
      shadow.remove();
      shadow = null;
    }
  }
}


