import {DragFeedback, DragFeedbackFactory, StateIdType} from "core/types";
import {WidgetDragDropEvent, WidgetDragEvent} from "drag-handlers/types";
import {Graph} from "modules/graph";
import {AppBus} from "bus/app-bus";
import {ViewController} from "template/view-controller";

export const SimpleFeedbackModule = {
  $type: SimpleFeedbackModuleImpl,
  $inject: ['AppBus', 'Graph', 'ViewController'],
  $item: 'simple'
}

function SimpleFeedbackModuleImpl(appBus: AppBus, graph: Graph, view: ViewController): DragFeedbackFactory {
  return function (vertexId: StateIdType, overState: StateIdType): DragFeedback {
    return SimpleFeedback(vertexId, overState);
  }

  function SimpleFeedback(vertexId: StateIdType, overState: StateIdType): DragFeedback {
    const bounds = graph.getCanvasBounds(vertexId);
    const widget = view.createToolWidget('$shape-drag-drop',bounds);

    return {
      move(e: WidgetDragEvent) {
        widget.refresh({x: bounds.x + e.dx, y: bounds.y + e.dy, width: bounds.width, height: bounds.height});
      },
      destroy() {
        widget.remove();
      },
      drop(e: WidgetDragDropEvent) {
        appBus.moveNode.fire({
          id: vertexId,
          eventType: 'move',
          x: e.x - (e.canvasX - (bounds.x + e.dx)),
          y: e.y - (e.canvasY - (bounds.y + e.dy)),
          target: overState
        });
      },
    }
  }
}
