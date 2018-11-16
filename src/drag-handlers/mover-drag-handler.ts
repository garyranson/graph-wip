import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "modules/shadow-widget-factory";
import {State, StateIdType, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";
import {ModelController} from "modules/model-controller";
import {ContainmentManager} from "modules/containment-manager";

export const MoverDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory', 'ModelController', 'ContainmentManager'],
  $name: 'MoverDragHandler',
  $type: MoverDragHandler,
  $item: 'mover'
}

function MoverDragHandler(
  appBus: AppBus,
  createShadow: ShadowWidgetFactory,
  model: ModelController,
  container: ContainmentManager,
): DragHandlerFactory {

  return (state: State/*, actionData: string, x: number, y: number*/) => {
    return createMover(state as VertexState);
  }

  function createMover(vertex: VertexState): DragHandler {
    const bounds = model.getVertexCanvasBounds(vertex.id);
    let overVertexId: StateIdType;
    let dragObject = createShadow.create(bounds, '$shape-drag-drop', 'tool');

    return {move, drop, cancel, over}

    function move(e: WidgetDragEvent) {
      dragObject.update({x: bounds.x + e.dx, y: bounds.y + e.dy});
    }

    function drop(e: WidgetDragDropEvent) {

      if (!container.canContain(e.id, vertex.id)) {
        console.log(`can't drop here!`);
        cancel();
        return;
      }

      const b = dragObject.getBounds();
      const dx = e.canvasX - b.x;
      const dy = e.canvasY - b.y;

      appBus.moveNode.fire({
        id: vertex.id,
        eventType: 'move',
        x: e.x - dx,
        y: e.y - dy,
        target: e.id
      });
      cancel();
    }

    function over(e: WidgetDragOverEvent) {
      if (overVertexId === e.id) return;
      overVertexId === e.id;
      console.log('over:',vertex.id,'under',e.id);
      return container.canContain(e.id, vertex.id) ? 'px-drag-over' : 'px-no-drop';
    }

    function cancel() {
      if (!dragObject) return;
      dragObject.remove();
      dragObject = null;
    }
  }
}
