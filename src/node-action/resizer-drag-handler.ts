import DragHandlerBase from "../peracto/drag-handler-base";
import {DragHandlerData, GpNode, GpNodeView} from "../types";
import NodeTemplateLibrary from "../Templates/template-library";

export default class ResizerDragHandler extends DragHandlerBase {

  private dragObject: GpNodeView;
  private shadow : GpNode;
  private width: number;
  private height: number;
  private position: string;
  private x: number;
  private y: number;

  init(data: DragHandlerData) {
    this.shadow = this.getSourceNode().createShadow();
    this.position = this.getGestureEvent().data;
    this.width = this.shadow.width;
    this.height = this.shadow.height;
    this.x = this.shadow.x;
    this.y = this.shadow.y;

    this.dragObject = this.getGraphView().appendNodeView(
      NodeTemplateLibrary.createView(this.shadow, '$node-resize')
    );
  }

  move(dx: number, dy: number, e: MouseEvent) {

    switch(this.position) {
      case 'br' : 
        this.shadow.width = this.width + dx;
        this.shadow.height = this.height + dy;
        break;
      case 'tr' :
        this.shadow.width = this.width + dx;
        this.shadow.y = this.y + dy;
        this.shadow.height = this.height - dy;
        break;
      case 'tl' :
        this.shadow.x = this.x + dx;
        this.shadow.y = this.y + dy;
        this.shadow.width = this.width - dx;
        this.shadow.height = this.height - dy;
        break;
      case 'bl' :
        this.shadow.x = this.x + dx;
        this.shadow.width = this.width - dx;
        this.shadow.height = this.height + dy;
        break;
    }
    this.dragObject.refresh();
  }

  drop(dx: number, dy: number, e: MouseEvent) {
    const node = this.getSourceNode();
    setTimeout(() => {
      node.setLocation(this.shadow.x,this.shadow.y);
      node.setSize(this.shadow.width, this.shadow.height);
    }, 10);
  }

  cancel() {
    if (this.dragObject) {
      this.dragObject.remove();
      this.dragObject = null;
    }
  }
}
