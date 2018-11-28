import {DragFeedback, DragFeedbackFactory, StateIdType} from "core/types";
import {WidgetDragDropEvent, WidgetDragEvent} from "drag-handlers/types";
import {Graph} from "modules/graph";
import {ShadowWidgetFactory} from "template/shadow-widget-factory";
import {AppBus} from "bus/app-bus";

export const SimpleFeedbackModule = {
  $type: SimpleFeedbackModuleImpl,
  $inject: ['AppBus', 'Graph', 'ShadowWidgetFactory'],
  $item: 'simple'
}

function SimpleFeedbackModuleImpl(appBus: AppBus, graph: Graph, createShadow: ShadowWidgetFactory): DragFeedbackFactory {
  return function (vertexId: StateIdType, overState: StateIdType): DragFeedback {
    return SimpleFeedback(vertexId, overState);
  }

  function SimpleFeedback(vertexId: StateIdType, overState: StateIdType): DragFeedback {
    const bounds = graph.getCanvasBounds(vertexId);
    let dragObject = createShadow.createVertex(bounds, '$shape-drag-drop', 'tool');

    return {
      destroy: clear,
      drop,
      move
    }

    function drop(e: WidgetDragDropEvent) {
      const b = dragObject.getBounds();
      const dx = e.canvasX - b.x;
      const dy = e.canvasY - b.y;

      appBus.moveNode.fire({
        id: vertexId,
        eventType: 'move',
        x: e.x - dx,
        y: e.y - dy,
        target: overState
      });

    }

    function move(e: WidgetDragEvent) {
      dragObject.update({x: bounds.x + e.dx, y: bounds.y + e.dy});
    }

    function clear() {
      dragObject.remove();
    }
  }
}
