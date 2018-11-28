import {BoundsLike, DragFeedback, DragFeedbackFactory, StateIdType, VertexMove, VertexState} from "core/types";
import {WidgetDragDropEvent, WidgetDragEvent} from "drag-handlers/types";
import {ModelBusMoveNodeEvent} from "bus/model-bus";
import {Graph} from "modules/graph";
import {AppBus} from "bus/app-bus";

export const FlowFeedbackModule = {
  $type: FlowFeedbackModuleImpl,
  $inject: ['AppBus', 'Graph'],
  $item: 'flow'
}

function FlowFeedbackModuleImpl(appBus: AppBus, graph: Graph) : DragFeedbackFactory {
  return function (vertexId: StateIdType, overState: StateIdType): DragFeedback {
    return FlowLayoutFeedback(vertexId, overState);
  }

  function FlowLayoutFeedback(vertexId: StateIdType, overState: StateIdType): DragFeedback {

    const vertices = graph.getChildVertices(overState);
    const offset = graph.getCanvasBounds(overState);

    const grid = buildGrid(vertices);
    let over = -1;

    return {
      destroy: clear,
      drop,
      move
    }

    function drop(e: WidgetDragDropEvent) {
      const index = getInsertId(e.canvasX, e.canvasY);
      if(!index) return;
      appBus.moveNode.fire({
        id: vertexId,
        eventType: 'move',
        index,
        target: overState
      } as ModelBusMoveNodeEvent);
    }

    function move(e: WidgetDragEvent) {
      const i = findPos(e.canvasX, e.canvasY);
      if (over === i) return;
      _setCursor(over, 'off');
      _setCursor(i, 'on');
      over = i;
    }

    function clear() {
      if (over !== -1) {
        _setCursor(over, 'off');
      }
    }

    function getInsertId(x: number, y: number): VertexMove {
      if (vertices.length === 0) return {action: 'end'};
      const index = findPos(x, y);
      const q = vertices[index];
      const b4 = vertices[q ? index - 1 : vertices.length - 1];
      if (b4 && b4.id === vertexId) return;
      return {
        id: q ? q.id : undefined,
        action: q ? "before" : "end"
      };
    }

    function findPos(x: number, y: number): number {
      const _x = x - offset.x;
      const _y = y - offset.y
      const i = grid
        ? grid.findIndex((v) => _y <= v.b && _y >= v.t && _x >= v.l && _x <= v.r)
        : -1;
      if (i == -1) return -1;
      return i + (calcOffset(_x, _y, grid[i]) ? 1 : 0);
    }

    function calcOffset(x: number, y: number, bx: XBoundsLike): boolean {
      const x1 = bx.l;
      const y1 = bx.b;
      const x2 = bx.r;
      const y2 = bx.t;
      const x3 = bx.r;
      const y3 = bx.b;
      const d = ((y2 - y3) * (x1 - x3) + (x3 - x2) * (y1 - y3));
      const a = ((y2 - y3) * (x - x3) + (x3 - x2) * (y - y3)) / d;
      const b = ((y3 - y1) * (x - x3) + (x1 - x3) * (y - y3)) / d;
      const c = 1 - a - b;
      return 0 <= a && a <= 1 && 0 <= b && b <= 1 && 0 <= c && c <= 1;
    }

    function _setCursor(i: number, state: "on" | "off") {

      const rect = vertices[i];
      const g = grid[i];

      if (rect) {
        appBus.widgetSelection.fire({
          type: 'hover',
          template: '$insert-cursor-left', //'$drag-cursor',
          selectionState: state,
          bounds: {
            x: offset.x + rect.x,
            y: offset.y + rect.y,
            width: rect.width,
            height: rect.height
          },
          id: 'left'
        });
      }

      const r = g ? vertices[i - 1] : vertices[vertices.length - 1];
      if (r) {
        appBus.widgetSelection.fire({
          type: 'hover',
          template: '$insert-cursor-right', //'$drag-cursor',
          selectionState: state,
          bounds: {
            x: offset.x + r.x,
            y: offset.y + r.y,
            width: r.width,
            height: r.height
          },
          id: 'right'
        });
      }
    }
  }

  interface XBoundsLike extends BoundsLike {
    udlr: number;
    row: number;
  }

  function buildGrid(vertices: VertexState[]): XBoundsLike[] {

    let top = 0;
    const gapX = 10 / 2;
    const gapY = 10 / 2;
    const rc = [];
    const end = vertices.length;

    let c = 0;
    let row = 0;
    while (c < end) {
      const rowStart = c;

      // Find end of row
      let x = vertices[c].x;
      while (c <= end) {
        const v = vertices[++c];
        if (!v || v.x <= x) break;
        x = v.x;
      }

      // Find maxY
      let maxY = 0;
      for (let i = rowStart; i < c; i++) {
        const v = vertices[i];
        maxY = Math.max(maxY, v.y + v.height);
      }

      //u - up    8
      //d - down  4
      //l - left  2
      //r - right 1

      const ud = ((rowStart > 0) ? 8 : 0) /*u*/ | ((c !== end) ? 4 : 0); //d
      const bottom = maxY + gapY + (ud & 4 ? gapY : 0);
      let left = 0;

      for (let i = rowStart; i < c; i++) {
        const v = vertices[i];
        const udlr = ud | ((i > rowStart) ? 2 : 0) /*l*/ | ((i != c - 1) ? 1 : 0); /*r*/
        const right = v.x + v.width + gapX + (udlr & 1 ? gapX : 0);
        rc.push({t: top, l: left, b: bottom, r: right, udlr, row});
        left = right + 1;
      }
      top = bottom + 1;
      row++;
    }
    return rc;
  }
}
