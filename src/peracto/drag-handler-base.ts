import {DragHandler, DragHandlerData, GpGraphView, GpNode, GpNodeView, GraphGestureEvent} from "../types";
import CellFinder from "./cell-finder";

const emptyGestureEvent : GraphGestureEvent = Object.freeze({
  nodeView: null,
  node: null,
  nodeId: null,
  action: null,
  data: null
});

export default abstract class DragHandlerBase implements DragHandler {
  private readonly sourceNodeView: GpNodeView;
  private readonly sourceNode: GpNode;
  private readonly finder: (node: Element) => GraphGestureEvent;

  private currentEvent: GraphGestureEvent;

  constructor(private graph: GpGraphView, private data: GraphGestureEvent) {
    this.finder = CellFinder(graph, emptyGestureEvent);
    this.sourceNodeView = data.nodeView;
    this.sourceNode = data.node;
  }

  getGraphView() : GpGraphView {
    return this.graph;
  }

  getGestureEvent() : GraphGestureEvent {
    return this.data;
  }

  getSourceNodeView() : GpNodeView {
    return this.sourceNodeView;
  }

  getSourceNode() : GpNode {
    return this.sourceNode;
  }

  init(data: DragHandlerData) {
  }

  start(e: MouseEvent, data: DragHandlerData) {
  }

  move(dx: number, dy: number, e: MouseEvent) {
  }

  drop(dx: number, dy: number, e: MouseEvent) {
  }

  targetChange(curr: GraphGestureEvent, prev: GraphGestureEvent) {
  }

  over(e: MouseEvent) {
    const currentEvent = this.finder(e.relatedTarget as Element);
    if (currentEvent != this.currentEvent) {
      const prev = this.currentEvent;
      this.currentEvent = currentEvent;
      this.targetChange(currentEvent, prev);
    }
  }

  cancel() {
  }
}
