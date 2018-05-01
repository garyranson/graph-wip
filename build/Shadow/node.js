"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Rectangle_1 = require("../Utils/Rectangle");
const size_1 = require("../Utils/size");
const Point_1 = require("../Utils/Point");
const dummyChildren = Object.freeze([]);
class GpNodeImpl {
    constructor(document, template, x, y, width, height) {
        this._document = document;
        this._objectId = document.createId();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.template = template;
        document.triggerCreate(this);
    }
    getId() {
        return this._objectId;
    }
    canSelect() {
        return this._objectId != 0;
    }
    setParent(value) {
        if (this._parent === value) {
            return;
        }
        if (this._parent) {
            this._parent.removeChild(this);
        }
        this._parent = value;
    }
    isContainer() {
        return false;
    }
    getParent() {
        return this._parent;
    }
    getBounds() {
        return new Rectangle_1.default(this.x, this.y, this.width, this.height);
    }
    getSize() {
        return new size_1.default(this.width, this.height);
    }
    setSize(width, height) {
        width = Math.round(width);
        height = Math.round(height);
        if (width !== this.width || height !== this.height) {
            this.width = width;
            this.height = height;
        }
        this._document.triggerResize(this);
    }
    setLocation(x, y) {
        x = Math.round(x);
        y = Math.round(y);
        if (this.x !== x || this.y !== y) {
            this.x = x;
            this.y = y;
            this._document.triggerMove(this);
        }
    }
    getLocation() {
        return new Point_1.default(this.x, this.y);
    }
    getLocalLocation() {
        let x = this.x;
        let y = this.y;
        let p = this._parent;
        while (p) {
            x -= p._parent.x;
            y -= p._parent.y;
            p = p._parent;
        }
        return new Point_1.default(x, y);
    }
    hasChildren() {
        return false;
    }
    getChildren() {
        return dummyChildren;
    }
    removeChild(child) {
        throw "not implemented";
    }
    appendChild(child) {
        throw "not implemented";
    }
    createShadow() {
        function shadow() {
        }
        shadow.prototype = this;
        return new shadow();
    }
}
exports.default = GpNodeImpl;
//# sourceMappingURL=node.js.map