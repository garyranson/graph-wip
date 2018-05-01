import DragHandler from "../peracto/drag-handler-base";
import {GpGraphView, GraphGestureEvent, NodeAction} from "../types";
import CanvasDragHandler from "./canvas-drag-handler";

export default class CanvasNodeAction implements NodeAction {
  canClick(): boolean {
    return false;
  }

  canDrag(): boolean {
    return true;
  }

  getDragTolerance(): number {
    return 0;
  }

  startDrag(): void {
  }

  createDragHandler(graph: GpGraphView, data: GraphGestureEvent, evt: Event) : DragHandler {
    return new CanvasDragHandler(graph,data);
  }

  tap(graphView: GpGraphView, clickCount: number, ge: GraphGestureEvent, evt: MouseEvent): void {
  }

  down(graphView: GpGraphView, ge: GraphGestureEvent, evt: MouseEvent): void {
  }
}


