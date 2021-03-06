import {AppBus} from "bus/app-bus";
import {getLine} from "core/scalaclip";
import {RectangleLike, State, StateIdType, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragDropEvent, WidgetDragEvent, WidgetDragOverEvent} from "./types";
import {Graph} from "modules/graph";
import {OrthConnector} from "layout/orthogonal";
import {calcOrientatedLine} from "core/geometry";
import {ViewController} from "template/view-controller";

export const ConnectorDragHandlerModule = {
  $inject: ['AppBus', 'ViewController', 'Graph'],
  $name: 'ConnectorDragHandler',
  $item: 'connector',
  $type: ConnectorDragHandler
}

function ConnectorDragHandler(
  appBus: AppBus,
  canvas: ViewController,
  graph: Graph
): DragHandlerFactory {
  return (state: State, actionData: string, x: number, y: number) => {
    const port = parseInt(actionData);
    return createMover(state as VertexState, x, y, port || port === 0 ? port : undefined);
  }

  function createMover(sourceState: VertexState, x: number, y: number, sourcePortIndex: number): DragHandler {
    const source = graph.getCanvasBounds(sourceState.id);
    const ports = sourceState && sourceState.__meta && sourceState.__meta.ports;
    const sourceId = sourceState.id;
    let targetId: StateIdType;
    let targetPortIndex = -1;
    let i = ports && ports[sourcePortIndex];
    let cx = source.x + ((i ? i[0] : 0.5) * source.width);
    let cy = source.y + ((i ? i[0] : 0.5) * source.height);

    let widget = canvas.createToolWidget('$connector', getLine(source, null, {x1: cx, y1: cy, x2: x, y2: y}));
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
          from: sourceState.id,
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
      const l = calcOrientatedLine(source, t);
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
