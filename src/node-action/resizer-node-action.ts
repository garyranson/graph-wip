import DragHandler from "../peracto/drag-handler-base";
import {GpGraphView, GraphGestureEvent, NodeAction} from "../types";
import ResizerDragHandler from "./resizer-drag-handler";

export default class ResizerNodeAction implements NodeAction {
  canClick(): boolean {
    return true;
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
    return new ResizerDragHandler(graph,data);
  }

  tap(graphView: GpGraphView, clickCount: number, ge: GraphGestureEvent, evt: MouseEvent): void {
  }

  down(graphView: GpGraphView, ge: GraphGestureEvent, evt: MouseEvent): void {
    graphView.getSelectionManager().toggle(ge.node);
  }



}


