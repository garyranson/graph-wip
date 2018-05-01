import DragHandler from "../peracto/drag-handler-base";
import {GpGraphView, GraphGestureEvent, NodeAction} from "../types";
import MoverDragHandler from "./mover-drag-handler";

export default class MoverNodeAction implements NodeAction {
  canClick(): boolean {
    return true;
  }

  canDrag(): boolean {
    return true;
  }

  getDragTolerance(): number {
    return 2;
  }

  startDrag(): void {
  }

  createDragHandler(graph: GpGraphView, data: GraphGestureEvent, evt: Event) : DragHandler {
    return new MoverDragHandler(graph,data);
  }

  tap(graphView: GpGraphView, clickCount: number, ge: GraphGestureEvent, evt: MouseEvent): void {
  }

  down(graphView: GpGraphView, ge: GraphGestureEvent, evt: MouseEvent): void {
    graphView.getSelectionManager().toggle(ge.node);
  }

}


