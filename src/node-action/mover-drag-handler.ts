import DragHandlerBase from "../peracto/drag-handler-base";
import {DragHandlerData, GpNode, GpNodeView} from "../types";
import NodeTemplateLibrary from "../Templates/template-library";

export default class MoverDragHandler extends DragHandlerBase {

  private dragObject: GpNodeView;
  private shadow: GpNode;
  private x: number;
  private y: number;

  init(data: DragHandlerData) {
    this.shadow = this.getSourceNode().createShadow();
    this.x = this.shadow.x;
    this.y = this.shadow.y;

    this.dragObject = this.getGraphView().appendNodeView(NodeTemplateLibrary
      .createView(this.shadow, '$node-drag')
    );
  }

  move(dx: number, dy: number, e: MouseEvent) {
    this.shadow.x = this.x + dx;
    this.shadow.y = this.y + dy;
    this.dragObject.refresh();
  }

  drop(dx: number, dy: number, e: MouseEvent) {
    const node = this.getSourceNode();
    setTimeout(() => {
      node.setLocation(this.shadow.x, this.shadow.y);
    }, 10);
  }

  cancel() {
    if (this.dragObject) {
      this.dragObject.remove();
      this.dragObject = null;
    }
  }
}
