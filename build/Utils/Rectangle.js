"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    clone() {
        return new Rectangle(this.x, this.y, this.width, this.height);
    }
    static fromLocationSize(point, size) {
        return new Rectangle(point.x, point.y, size.width, size.height);
    }
}
exports.default = Rectangle;
//# sourceMappingURL=Rectangle.js.map