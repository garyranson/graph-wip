import {AppBus} from "bus/app-bus";
import {DragFeedback, State, StateIdType, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";
import {ContainmentManager} from "modules/containment-manager";
import {Graph} from "modules/graph";
import {ShapeLibrary} from "modules/shape-library";
import {DragFeedbackHandlers} from "layout/feedback-manager";

export const MoverDragHandlerModule = {
  $inject: ['AppBus', 'Graph', 'ContainmentManager', 'ShapeLibrary', 'DragFeedbackHandlers'],
  $name: 'MoverDragHandler',
  $type: MoverDragHandler,
  $item: 'mover'
}

function MoverDragHandler(
  appBus: AppBus,
  graph: Graph,
  container: ContainmentManager,
  shapeLibrary: ShapeLibrary,
  feedbackHandlers: DragFeedbackHandlers
): DragHandlerFactory {

  return (state: State) => {
    return createMover(state as VertexState);
  }

  function createMover(vertex: VertexState): DragHandler {

    let overVertexId: StateIdType;
    let dropVertexId: StateIdType;
    let feedback: DragFeedback;

    appBus.widgetDragAction.fire({type: 'drag-start', id: vertex.id});

    return {
      move(e: WidgetDragEvent) {
        _ensureFeedback(e.id);
        if (feedback) feedback.move(e);
      },

      drop(e: WidgetDragDropEvent) {
        try {
          _ensureFeedback(e.id);
          if (feedback) feedback.drop(e);
        } finally {
          _cancel();
        }
      },

      over(e: WidgetDragOverEvent) {
        _ensureFeedback(e.id);
        return dropVertexId ? 'px-drag-over' : 'px-no-drop';
      },

      cancel: _cancel
    }

    function _cancel() {
      if (feedback) feedback.destroy();
      appBus.widgetDragAction.fire({type: 'drag-end', id: vertex.id});
      if (dropVertexId) _updateHighlight('off');
      dropVertexId = null;
      feedback = null;
    }

    function _ensureFeedback(id: StateIdType) {
      if (overVertexId === id) return;
      overVertexId === id;

      const over = container.getClosestContainer(id, vertex.id);

      if (over === dropVertexId) return;
      _updateHighlight('off');
      dropVertexId = over;

      if (feedback) {
        feedback.destroy();
        feedback = null;
      }

      if (!dropVertexId) return;
      _updateHighlight('on');

      const state = graph.getState(over);
      const s = shapeLibrary.get(state.type);
      const factory = feedbackHandlers.get(s.hasFeedback);
      feedback = factory ? factory(vertex.id, over) : null;
    }

    function _updateHighlight(selectionState: "on" | "off"): void {
      appBus.widgetSelection.fire({
        type: 'drag',
        template: '$drag-highlight',
        selectionState,
        bounds: graph.getCanvasBounds(dropVertexId),
        id:dropVertexId
      });
    }
  }
}
