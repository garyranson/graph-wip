import NodeTemplateLibrary from "../Templates/template-library";
import {GpGraphView, GpNode, GpNodeView, GraphGestureEvent} from "../types";

class SelectedNode {
  private timer: number = 0;

  constructor(
    private highlights: Map<number, SelectedNode>,
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

export default class GpNodeSelectionHandler {
  private selected = new Map<number, SelectedNode>();

  constructor(private graphView: GpGraphView) {
  }

  action(o: { current: GraphGestureEvent, previous: GraphGestureEvent }) {
    if (!o) {
      this.selected.forEach((h) => h.complete());
      this.selected.clear();
    } else {
      this.on(o.current.node);
    }
  }

  private on(node: GpNode) {
    if (!node) return;
    const nodeId = node.getId();

    let obj = this.selected.get(nodeId);

    if (obj) {
      obj.on();
      return;
    }

    this.selected.set(
      nodeId,
      new SelectedNode(
        this.selected,
        nodeId,
        this.graphView.appendNodeView(this.create(node))
      )
    );
  }

  private off(node: GpNode) {
    if (!node) return;

    const nodeId = node.getId();

    let obj = this.selected.get(nodeId);

    if (obj) {
      obj.off();
    }
  }


  toggle(node: GpNode) {
    if (!node) return;
    const nodeId = node.getId();
    const obj = this.selected.get(nodeId);

    if (obj) {
      this.off(node);
    } else {
      this.on(node);
    }
  }

  private create(node: GpNode) : GpNodeView {
    return NodeTemplateLibrary.createView(node, '$node-select')
  }
}
