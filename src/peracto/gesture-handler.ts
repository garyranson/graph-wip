import CellFinder from "./cell-finder";
import {DragHandler, GpGraphView, GraphGestureEvent, NodeAction} from "../types";
import GpDelegate from "./event";
import nodeActionLibrary from "../node-action/node-action-library";

const emptyGestureEvent : GraphGestureEvent = Object.freeze({
  nodeView: null,
  node: null,
  nodeId: null,
  action: null,
  data: null
});

export default class GestureHandler {
  finder: (node: Element) => GraphGestureEvent;
  currentEvent: GraphGestureEvent = emptyGestureEvent;
  currentAction: NodeAction = nodeActionLibrary.get('mover');

  public onOver = new GpDelegate<{current: GraphGestureEvent, previous: GraphGestureEvent}>();

  constructor(protected graph: GpGraphView) {
    this.finder = CellFinder(graph, emptyGestureEvent);
  }

  over(element: Element) : NodeAction {

    const currentEvent = this.finder(element as Element);

    if (currentEvent != this.currentEvent) {
      const previousEvent = this.currentEvent;
      console.log('element changes',currentEvent,previousEvent)

      if (previousEvent && previousEvent.node != currentEvent.node) {
        console.log('fire');
        this.onOver.fire({current: currentEvent, previous: previousEvent});
      } else {
        console.log('matches???',previousEvent.node,currentEvent.node);
      }

      this.currentAction = nodeActionLibrary.get(currentEvent.action||'canvas');
      this.currentEvent = currentEvent;
    }
    if (!this.currentEvent.action) {
      console.log(element);
    }
    console.log('action:'+this.currentEvent.action);
    return this.currentAction;
  }

  createDragHandler(e: MouseEvent) : DragHandler {
    this.onOver.fire(null);
    return this.currentAction.createDragHandler(this.graph, this.currentEvent, e);
  }

  clickHandler(clickCount: number, e: MouseEvent) {
    if (this.currentAction.canClick()) {
      this.currentAction.tap(this.graph, clickCount, this.currentEvent, e);
    }
  }

  down(e: MouseEvent) {
    this.currentAction.down(this.graph, this.currentEvent, e);
  }

  getCurrentAction() : NodeAction {
    return this.currentAction;
  }
}
