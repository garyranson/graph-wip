import DragHandler from "./drag-handler";
import CellFinder from "./cell-finder";
import {GpGraphView, GpNode, GpNodeView, GraphGestureEvent, HoverHandler} from "../types";
import NodeTemplateLibrary from "../Templates/template-library";
//import GpNodeResizeHandler from "./node-resizer-handler";

const emptyGestureEvent : GraphGestureEvent = Object.freeze({
  instance: null,
  context: null,
  nodeId: null,
  action: null,
  data: null
});


export interface GestureHub {
  canClick() : boolean;
  canDrag(): boolean;
  getDragTolerance() : number;
  startDrag(): void;
  createDragHandler(evt: Event) : DragHandler;
  tap(evt: MouseEvent, x: any) : void;
}

class CellMoverHub implements GestureHub {
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

  createDragHandler(evt: Event) : DragHandler {
    return null; //new DragHandler();
  }

  tap(e: MouseEvent, x: any) {
    console.log(`Click fired ${x.tapCount} times`);
  }

}


const actionCache = new Map<string,CellMoverHub>([
  ["mover",new CellMoverHub()]
]);



export default class GestureHandler {
  graph: GpGraphView;
  finder: (node: Element) => GraphGestureEvent;
  currentEvent: GraphGestureEvent = emptyGestureEvent;

  highlighter : Highlighter;


  constructor(graph: GpGraphView) {
    this.graph = graph;
    this.finder = CellFinder(graph, emptyGestureEvent);
    this.highlighter = new Highlighter(graph);
  }

  getCurrentAction() : GestureHub {
    return actionCache.get("mover");
  }

  over(evt: MouseEvent) {
    const currentEvent = this.finder(evt.relatedTarget as Element);
    if (currentEvent != this.currentEvent) {
      console.log(`Something has changed:${currentEvent.nodeId}:${currentEvent.action}:${currentEvent.data}`);

      const previousEvent  = this.currentEvent;

      if(previousEvent && previousEvent.context!=currentEvent.context) {
        this.highlighter.off(previousEvent.context);
        this.highlighter.on(currentEvent.context);
      }

      this.currentEvent = currentEvent;
    }
  }

  getDragTolerance(e: MouseEvent) {
    if(this.currentEvent.action=='canvas') {
      return 0;
    }

    return 10;
  }

  createDragHandler(e: MouseEvent): DragHandler {
    if(this.currentEvent.action=='resizer') {
      //return new GpNodeResizeHandler(this.graph,this.currentEvent);
    }
    return null;
  }

  createHoverHandler(e: MouseEvent): HoverHandler {
    return null;
  }
}



class Highlighter {
  highlights = new Map<number,{view:GpNodeView, timer:number}>();
  graphView: GpGraphView;

  constructor(graphView: GpGraphView) {
    this.graphView = graphView;
  }

  on(node: GpNode) {

    if(!node) return;

    const nodeId = node.getId();
    const obj = this.highlights.get(nodeId);

    const element = this.graphView.getInstance(nodeId);
    element.addClass('hover');

    if(obj) {
      if (obj.timer) {
        clearTimeout(obj.timer);
        obj.timer = 0;
      }
      obj.view.removeClass('gpFade');



    } else {
      const view = NodeTemplateLibrary.createView(node, 'outline');
      this.graphView.appendNodeView(view);

      this.highlights.set(nodeId, {
        view,
        timer: 0
      });
    }
  }

  off(node: GpNode) {

    if(!node) return;

    const nodeId = node.getId();
    const obj = this.highlights.get(nodeId);

    const element = this.graphView.getInstance(nodeId);
    element.removeClass('hover');


    if(!obj && obj.timer) return;

    obj.view.addClass('gpFade');
    obj.timer = setTimeout(() => {
      const obj = this.highlights.get(nodeId);
      if(!obj) return;
      this.highlights.delete(nodeId);
      obj.view.remove();
    },500);
  }
}
