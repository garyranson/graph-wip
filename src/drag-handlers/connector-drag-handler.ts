import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "template/shadow-widget-factory";
import {clipLine} from "core/scalaclip";
import {EdgeState, RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";
import {Graph} from "modules/graph";

export const ConnectorDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory','Graph'],
  $name: 'ConnectorDragHandler',
  $item: 'connector',
  $type: ConnectorDragHandler
}

function ConnectorDragHandler(
  appBus: AppBus,
  createShadow: ShadowWidgetFactory,
  graph: Graph
): DragHandlerFactory {

  return (state: State, actionData: string, x: number, y: number, payload?: any) => {
    return createMover(state as VertexState, x, y, payload && payload.callback);
  }

  function createMover(sourceState: VertexState, x: number, y: number, cb: Function): DragHandler {
    const source =  graph.getCanvasBounds(sourceState.id);
    let cx = source.x + (source.width / 2);
    let cy = source.y + (source.height / 2);
    let widget = createShadow.createEdge(clipLine(source, {x1: cx, y1: cy, x2: x, y2: y}), '$connector', 'tool');
    let target: RectangleLike = null;

    return {move, drop, cancel, over}

    function move(event: WidgetDragEvent) {
      const l = {x1: cx, y1: cy, x2: event.canvasX, y2: event.canvasY}
      const s = clipLine(source, l);
      const t = (target) ? clipLine(target, l) : s;
      widget.update({x1: s.x1, y1: s.y1, x2: t.x2, y2: t.y2});
    }

    function drop(e: WidgetDragDropEvent) {
      const state = widget.getState() as EdgeState;
      appBus.createEdge.fire({
        eventType: 'create/edge',
        id: state.id,
        from: sourceState.id,
        to: e.id
      });
      cancel();
    }

    function over(event: WidgetDragOverEvent) {
      target = graph.getCanvasBounds(event.id);
    }

    function cancel() {
      if (!widget) return;
      widget.remove();
      widget = null;
    }
  }
}
