import Size from "./size";
import Point from "./Point";

export default class Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;

  constructor(x: number, y: number, width: number, height:number) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }


  clone() : Rectangle {
    return new Rectangle(this.x,this.y,this.width,this.height);
  }

  public static fromLocationSize(point: Point, size: Size) {
    return new Rectangle(point.x,point.y,size.width,size.height);
  }
}
