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

  function createResizer(vertex : VertexState, position: string): DragHandler {
    let shadow = shadowFactory.create(vertex, '$node-diagramResize', 'tool');
    let {x, y, width, height} = vertex;

    return {move, drop, cancel}

    function move(e: WidgetDragEvent) {
      shadow.update(getMove(e.dx, e.dy));
    }

    function getMove(dx: number, dy: number): RectangleLike {
      switch (position) {
        case 'br' :
          return {x, y, width: width + dx, height: height + dy};
        case 'tr' :
          return {x, y: y + dy, width: width + dx, height: height - dy};
        case 'tl' :
          return {x: x + dx, y: y + dy, width: width - dx, height: height - dy};
        case 'bl' :
          return {x: x + dx, y, width: width - dx, height: height + dy};
        default:
          return {x, y, width, height};
      }
    }

    function drop(e: WidgetDragEvent) {
      appBus.nodeRefresh.fire({
        id: vertex.id,
        eventType: 'resize',
        payload: shadow.getBounds()
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
