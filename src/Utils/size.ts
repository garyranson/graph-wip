import ICloneable from "../types";

export default class Size  implements ICloneable {
  width: number;
  height: number;
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  clone() : Size {
    return new Size(this.width,this.height);
  }
}
