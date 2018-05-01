import DragHandlerBase from "../peracto/drag-handler-base";
import {DragHandlerData, GpNode, GpNodeView} from "../types";
import NodeTemplateLibrary from "../Templates/template-library";

export default class CanvasDragHandler extends DragHandlerBase {

  private dragObject: GpNodeView;
  private shadow: GpNode;
  private x: number;
  private y: number;

  init(data: DragHandlerData) {
    this.shadow = this.getSourceNode().createShadow();

    this.x = data.pointerX;
    this.y = data.pointerY;

    this.shadow.x = this.x;
    this.shadow.y = this.y;
    this.shadow.width = 0;
    this.shadow.height = 0;

    this.dragObject = this.getGraphView().appendNodeView(NodeTemplateLibrary
      .createView(this.shadow, '$node-selector-band')
    );
  }

  move(dx: number, dy: number, e: MouseEvent) {
    console.log(`delta:${dx},${dy}`)

    if(dx>0 && dy>0) {
      this.shadow.x = this.x;
      this.shadow.y = this.y;
      this.shadow.width = dx;
      this.shadow.height = dy;
    }
    else if(dx>0 && dy < 0) {
      this.shadow.x = this.x;
      this.shadow.y = this.y + dy;
      this.shadow.width = dx;
      this.shadow.height = -dy;
    }
    else if(dx<0 && dy < 0) {
      this.shadow.x = this.x + dx;
      this.shadow.y = this.y + dy;
      this.shadow.width = -dx;
      this.shadow.height = -dy;
    }
    else if(dx<0 && dy > 0) {
      this.shadow.x = this.x + dx;
      this.shadow.y = this.y;
      this.shadow.width = -dx;
      this.shadow.height = dy;
    } else {
      this.shadow.x = this.x;
      this.shadow.y = this.y;
      this.shadow.width = 0;
      this.shadow.height = 0;
    }

    this.dragObject.refresh();
  }

  drop(dx: number, dy: number, e: MouseEvent) {

    this.getGraphView().getContainedNodes(
      this.shadow.x,
      this.shadow.y,
      this.shadow.width,
      this.shadow.height
    ).forEach((node) => {
      node.addClass('highlight');
    });
  }

  cancel() {
    if (this.dragObject) {
      this.dragObject.remove();
      this.dragObject = null;
    }
  }
}
