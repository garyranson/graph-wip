import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "modules/shadow-widget-factory";
import {State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent} from "./types";

export const MoverDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory'],
  $name: 'MoverDragHandler',
  $type: MoverDragHandler,
  $item: 'mover'
}
function MoverDragHandler(appBus: AppBus, createShadow: ShadowWidgetFactory): DragHandlerFactory {

  return (state: State/*, actionData: string, x: number, y: number*/) => {
    return createMover(state as VertexState);
  }

  function createMover(vertex: VertexState): DragHandler {
    let dragObject = createShadow.create(vertex, '$node-mouseDragDrag', 'tool');
    const {x, y} = vertex;

    return {move, drop, cancel}

    function move(e: WidgetDragEvent) {
      dragObject.update({x: x + e.dx, y: y + e.dy});
    }

    function drop(e: WidgetDragDropEvent) {
      appBus.nodeRefresh.fire({
        id: vertex.id,
        eventType: 'move',
        payload: {bounds: dragObject.getBounds(), target: e.id}
      });
      cancel();
    }

    function cancel() {
      if (!dragObject) return;
      dragObject.remove();
      dragObject = null;
    }
  }
}



