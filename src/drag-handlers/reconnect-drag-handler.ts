import {AppBus} from "bus/app-bus";
import {getLine} from "core/scalaclip";
import {EdgeState, RectangleLike, State, StateIdType, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";
import {Graph} from "modules/graph";
import {OrthConnector} from "layout/orthogonal";
import {calcOrientatedLine} from "core/geometry";
import {ViewController} from "template/view-controller";

export const ReconnectDragHandlerModule = {
  $inject: ['AppBus', 'ViewController', 'Graph'],
  $name: 'ReconnectDragHandler',
  $item: 'reconnect',
  $type: ReconnectDragHandler
}

function ReconnectDragHandler(
  appBus: AppBus,
  canvas: ViewController,
  graph: Graph
): DragHandlerFactory {
  return (state: State, actionData: string, x: number, y: number) => {
    return createMover(state as EdgeState, x, y, actionData);
  }

  function createMover(state: EdgeState, x: number, y: number, actionData: string): DragHandler {
    const source = graph.getCanvasBounds(actionData === 'from' ? state.from : state.to);
//    const floatState = graph.getVertex(actionData==='from'?state.from:state.to);
//    const ports = floatState && floatState.__meta && floatState.__meta.ports;

    let targetId = state.to;
    let sourceId = state.from;
    let targetPortIndex = state.targetPortIndex;
    let sourcePortIndex = state.sourcePortIndex;

    let widget = canvas.createToolWidget('$connector', {...state});
    let target: RectangleLike = null;

    return {
      move(event: WidgetDragEvent) {
        if (target) return;
        const j = 10; /// jetty size
        update({
          x: event.canvasX - (0.5 * j),
          y: event.canvasY - (0.5 * j),
          width: j,
          height: j
        });
      },

      drop(e: WidgetDragDropEvent) {
        appBus.createEdge.fire({
          eventType: 'create/edge',
          id: targetId,
          from: state.id,
          to: e.id,
          sourcePortIndex,
          targetPortIndex
        });
        cancel();
      },

      over(e: WidgetDragOverEvent) {

        appBus.widgetEnterLeave.fire({
          enter: e.id
        });

        target = graph.getRootId() === e.id ? null : graph.getCanvasBounds(e.id);

        if (target) {
          targetId = e.id;
          targetPortIndex = e.action !== 'connector' ? undefined : parseInt(e.actionData);
          update(target);
        } else {
          targetPortIndex = undefined;
          targetId = undefined;
        }
      },
      cancel
    }

    function cancel() {
      if (!widget) return;
      widget.remove();
      widget = null;
    }

    function update(t: RectangleLike): void {
      widget.refresh(createState(t));
    }

    function createState(t: RectangleLike): object {
      const l = (actionData === 'from')
        ? calcOrientatedLine(source, t)
        : calcOrientatedLine(t, source)

      const se = graph.getPort(sourceId, sourcePortIndex);
      const te = target ? graph.getPort(targetId, targetPortIndex) : null;

      return OrthConnector({
          x1: se ? (source.x + (se[0] * source.width)) : l.x1,
          y1: se ? (source.y + (se[1] * source.height)) : l.y1,
          x2: te ? (target.x + (te[0] * target.width)) : l.x2,
          y2: te ? (target.y + (te[1] * target.height)) : l.y2,
        },
        source,
        t
      );
    }


  }
}
