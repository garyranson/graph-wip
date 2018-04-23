/**
 * Class: mxRubberband
 *
 * Event handler that selects rectangular regions. This is not built-into
 * <mxGraph>. To enable rubberband selection in a graph, use the following code.
 *
 * Example:
 *
 * (code)
 * let rubberband = new mxRubberband(graph);
 * (end)
 *
 * Constructor: mxRubberband
 *
 * Constructs an event handler that selects rectangular regions in the graph
 * using rubberband selection.
 */
import {DragHandler, DragHandlerData, GpGraphView, GpNodeView, GraphGestureEvent} from "../types";
import {createSvgElement} from "../Utils/svg";

export default class GpNodeResizeHandler implements DragHandler {
  startX: number;
  startY: number;
  childOffsetX: number;
  childOffsetY: number;
  graph: GpGraphView;
  data: GraphGestureEvent;

  shadowNode: SVGRectElement;

  constructor(graph: GpGraphView, data: GraphGestureEvent) {
//    this.index = parseInt(data.data);
    this.graph = graph;
    this.data = data;
  }

  init(data: DragHandlerData) {
  }

  start(e: MouseEvent, data: DragHandlerData) {
    //this.inTolerance = true;
    this.childOffsetX = 0;
    this.childOffsetY = 0;
    this.startX = data.pointerX;
    this.startY = data.pointerY;
    const node = this.data.context;
    this.shadowNode = createSvgElement('rect', {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      style: 'stroke-width:4;fill:none,stroke:black',
    });
    this.graph.getContainer().appendChild(this.shadowNode);
  }

  move(e: MouseEvent) {

  }

  cancel(): void {
  }

  drop(e: MouseEvent): void {
  }

  getState(): GpNodeView {
    return undefined;
  }

  over(e: MouseEvent): void {
  }

  targetChange(curr: GraphGestureEvent, prev: GraphGestureEvent) {
  }
}
