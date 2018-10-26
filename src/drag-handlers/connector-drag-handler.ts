import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "modules/shadow-widget-factory";
import {WidgetCanvas} from "modules/widget-canvas";
import {clipLine} from "core/scalaclip";
import {EdgeState, RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";

export const ConnectorDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory', 'WidgetCanvas'],
  $name: 'ConnectorDragHandler',
  $item: 'connector',
  $type: ConnectorDragHandler
}
function ConnectorDragHandler(
  appBus: AppBus,
  createShadow: ShadowWidgetFactory,
  canvas: WidgetCanvas
): DragHandlerFactory {

  return (state: State, actionData: string, x: number, y: number,payload?: any) => {
    return createMover(state as VertexState, x, y, payload && payload.callback);
  }

  function createMover(v: VertexState, x: number, y: number, cb: Function): DragHandler {
    const clipper = v;
    const vcentre = {x: v.x + (v.width / 2), y: v.y + (v.height / 2)};
    let widget = createShadow.create(<any>clipLine(clipper, vcentre.x, vcentre.y, x, y), '$connector', 'tool');

    let tclipper: RectangleLike = null;

    return {move, drop, cancel, over}

    function move(event: WidgetDragEvent) {
      const q2 = clipLine(clipper, vcentre.x,vcentre.y, event.x, event.y);
      if (!tclipper) {
        //widget.update({x1: q2.p2.x, y1: q2.p2.y, x2: event.x, y2: event.y});
        widget.update({x1: q2.x2, y1: q2.y2, x2: event.x, y2: event.y,from: v.id});
      } else {
        const q1 = clipLine(tclipper, vcentre.x, vcentre.y, event.x, event.y);
        //widget.update({x1: q2.p2.x, y1: q2.p2.y, x2: q1.p1.x, y2: q1.p1.y});
        widget.update({x1: q2.x2, y1: q2.y2, x2: q1.x1, y2: q1.y1,from: v.id});
      }
    }

    function drop(e: WidgetDragDropEvent) {
      const state = widget.getState() as EdgeState;
      appBus.nodeRefresh.fire({eventType: 'create/edge', id: state.id, payload: {from: v.id, to: e.id}});
      cancel();
    }

    function over(event: WidgetDragOverEvent) {
      tclipper = event.id === '0' ? null : canvas.getWidget(event.id).state as VertexState;
    }

    function cancel() {
      if (!widget) return;
      widget.remove();
      widget = null;
    }
  }
}
