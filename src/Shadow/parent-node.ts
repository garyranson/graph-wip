import {GpNode, GpParentNode} from "../types";
import GpNodeImpl from "./node";

const emptyChildren = Object.freeze([]) as GpNode[];

export default class GpParentNodeImpl extends GpNodeImpl implements GpParentNode {
  protected _children: GpNode[] = emptyChildren;

  hasChildren() : boolean {
    return this._children.length>0;
  }

  getChildren() : GpNode[] {
    return this._children;
  }

  removeChild(child: GpNode) : void {
    this._children = this._children.filter((o) => o!==child)
  }

  appendChild(child: GpNode) : void {
    child.setParent(this);
    this._children = [...this._children, child];
  }

  isContainer() : boolean {
    return true;
  }
}
