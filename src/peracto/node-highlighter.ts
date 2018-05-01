import NodeTemplateLibrary from "../Templates/template-library";
import {GpGraphView, GpNode, GpNodeView, GraphGestureEvent} from "../types";


class HighlightNode {
  private timer: number = 0;

  constructor(
    private highlights: Map<number, HighlightNode>,
    private nodeId: number,
    private view: GpNodeView
  ) {
    this.on();
  }

  on() {
    if (this.timer) clearTimeout(this.timer);
    this.view.removeClass('gp-off').addClass('gp-on');
  }

  off() {
    if (this.timer) clearTimeout(this.timer);
    this.view.removeClass('gp-on').addClass('gp-off');
    this.timer = setTimeout(() => this.complete(), 250);
  }

  complete() {
    if(this.timer) clearTimeout(this.timer);
    this.highlights.delete(this.nodeId);
    this.view.remove();
    this.timer = 0;
  }
}

export default class NodeHighlighter {
  highlights = new Map<number, HighlightNode>();
  graphView: GpGraphView;

  constructor(graphView: GpGraphView) {
    this.graphView = graphView;
  }

  action(o: { current: GraphGestureEvent, previous: GraphGestureEvent }) {
    if (!o) {
      this.highlights.forEach((h) => h.complete());
      this.highlights.clear();
    } else {
      this.off(o.previous.node);
      this.on(o.current.node);
    }
  }

  private on(node: GpNode) {
    if (!node) return;
    const nodeId = node.getId();

    if(!node.canSelect()) {
      return;
    }

    let obj = this.highlights.get(nodeId);

    if (obj) {
      obj.on();
      return;
    }

    this.highlights.set(
      nodeId,
      new HighlightNode(
        this.highlights,
        nodeId,
        this.graphView.appendNodeView(this.create(node))
      )
    );
  }

  private off(node: GpNode) {
    if (!node) return;
    const nodeId = node.getId();
    const obj = this.highlights.get(nodeId);
    if (obj) {
      obj.off();
    }
  }

  private create(node: GpNode) : GpNodeView {
    return NodeTemplateLibrary.createView(node, '$node-highlight')
  }
}
