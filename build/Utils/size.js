"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Size {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    clone() {
        return new Size(this.width, this.height);
    }
}
exports.default = Size;
//# sourceMappingURL=size.js.map