import {AppBus} from "bus/app-bus";
import {DragFeedback, State, StateIdType, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";
import {ContainmentManager} from "modules/containment-manager";
import {Graph} from "modules/graph";
import {ShapeLibrary} from "modules/shape-library";
import {DragFeedbackHandlers} from "layout/feedback-manager";
import {CursorManager} from "template/cursor-manager";
import {Widget} from "template/widget";

export const WidgetMoverDragHandlerModule = {
  $inject: ['AppBus', 'Graph', 'ContainmentManager', 'ShapeLibrary', 'DragFeedbackHandlers', 'CursorManager'],
  $name: 'WidgetMoverDragHandler',
  $type: WidgetMoverDragHandler,
  $item: 'mover'
}

function WidgetMoverDragHandler(
  appBus: AppBus,
  graph: Graph,
  container: ContainmentManager,
  shapeLibrary: ShapeLibrary,
  feedbackHandlers: DragFeedbackHandlers,
  cursorManager: CursorManager
): DragHandlerFactory {

  const cursor = Cursor('$drag-highlight');

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
      cursor.release();
      //if (dropVertexId) _updateHighlight('off');
      dropVertexId = null;
      feedback = null;
    }

    function _ensureFeedback(id: StateIdType) {
      if (overVertexId !== id) {
        overVertexId === id;
        closestChanged(container.getClosestContainer(id, vertex.id));
      }
    }

    function closestChanged(to: StateIdType): void {
      if (dropVertexId === to) return;

      if (to) {
        cursor.on(to, graph.getCanvasBounds(to));

        const state = graph.getState(to);
        const shape = shapeLibrary.get(state.type);
        const factory = feedbackHandlers.get(shape.hasFeedback);
        if (feedback) feedback.destroy();
        feedback = factory ? factory(vertex.id, to) : null;
      } else if (feedback) {
        feedback.destroy();
        feedback = null;
      }
      dropVertexId = to;
    }
  }

  function Cursor(type: string) {
    let _widget: Widget;
    let _id: StateIdType;

    return {
      on(id: StateIdType, state: object) {
        if (id === _id) return;
        if (_id) cursorManager.release(type, _widget, _id);
        if (id) _widget = cursorManager.create(type, id).refresh(state).removeClass('px-off');
        _id = id;
      },
      release() {
        if (_id) cursorManager.release(type, _widget, _id);
        _id = undefined;
      }
    }
  }
}
