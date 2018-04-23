import {GpNode} from "../types";

import Rectangle from "../Utils/Rectangle";
import Size from "../Utils/size";
import Point from "../Utils/Point";
import GpParentNode from "./parent-node";
import GpGraph from "./graph";

const dummyChildren = Object.freeze([]) as GpNode[];

export default class GpNodeImpl implements GpNode {

  protected readonly _document: GpGraph;
  protected readonly _objectId: number;
  protected _parent: GpParentNode;

  x: number;
  y: number;
  width: number;
  height: number;
  template: string;

  constructor(document: GpGraph, template: string, x: number, y: number, width: number, height: number) {
    this._document = document;
    this._objectId = document.createId();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.template = template;
    document.triggerCreate(this);
  }

  getId(): number {
    return this._objectId;
  }

  setParent(value: GpParentNode) {
    if (this._parent === value) {
      return;
    }
    if (this._parent) {
      this._parent.removeChild(this);
    }
    this._parent = value;
  }

  isContainer() : boolean {
    return false;
  }

  getParent(): GpParentNode {
    return this._parent;
  }

  getBounds(): Rectangle {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  getSize(): Size {
    return new Size(this.width, this.height);
  }

  setSize(width: number, height: number): void {
    width = Math.round(width);
    height = Math.round(height);
    if (width !== this.width || height !== this.height) {
      this.width = width;
      this.height = height;
    }
    this._document.triggerResize(this);

  }

  setLocation(x: number, y: number): void {
    x = Math.round(x);
    y = Math.round(y);
    if (this.x !== x || this.y !== y) {
      this.x = x;
      this.y = y;
      this._document.triggerMove(this);
    }
  }

  getLocation(): Point {
    return new Point(this.x, this.y);
  }

  getLocalLocation(): Point {
    let x = this.x;
    let y = this.y;

    let p = this._parent;

    while (p) {
      x -= p._parent.x;
      y -= p._parent.y;
      p = p._parent;
    }
    return new Point(x, y);
  }

  hasChildren(): boolean {
    return false;
  }

  getChildren(): GpNode[] {
    return dummyChildren;
  }

  removeChild(child: GpNode): void {
    throw "not implemented";
  }

  appendChild(child: GpNode): void {
    throw "not implemented";
  }
}
