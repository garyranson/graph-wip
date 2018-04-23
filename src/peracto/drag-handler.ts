import {DragHandler, DragHandlerData, GpGraphView, GpNode, GpNodeView, GraphGestureEvent} from "../types";
import CellFinder from "./cell-finder";

const emptyGestureEvent : GraphGestureEvent = Object.freeze({
  instance: null,
  context: null,
  nodeId: null,
  action: null,
  data: null
});

export default abstract class DragHandlerBase implements DragHandler {
  readonly graph: GpGraphView;
  readonly state: GpNodeView;
  readonly cell: GpNode;
  readonly cellId: string;
  readonly finder: (node: Element) => GraphGestureEvent;

  currentEvent: GraphGestureEvent = emptyGestureEvent;

  constructor(graph: GpGraphView, data: GraphGestureEvent) {
    this.finder = CellFinder(graph, emptyGestureEvent);
    this.graph = graph;
    this.state = data.instance;
    this.cell = data.context;
    this.cellId = data.nodeId;
    this.currentEvent = data;
  }

  init(data: DragHandlerData) {
  }

  start(e: MouseEvent, data: DragHandlerData) {
  }

  move(e: MouseEvent) {
    console.log(`drag:${e.clientX}:${e.clientY}`);
  }

  drop(e: MouseEvent) {
    console.log(`drop:${e.clientX}:${e.clientY}`);
  }

  targetChange(curr: GraphGestureEvent, prev: GraphGestureEvent) {
  }

  getState() : GpNodeView {
    return this.state;
    //return this.currentEvent.cellState;
  }

  over(e: MouseEvent) {
    console.log(e.relatedTarget);
    const currentEvent = this.finder(e.relatedTarget as Element);
    if (currentEvent != this.currentEvent) {
      console.log('Drag element changed', currentEvent);
      const prev = this.currentEvent;
      this.currentEvent = currentEvent;
      this.targetChange(currentEvent, prev);
    }
  }

  cancel() {
  }
}
