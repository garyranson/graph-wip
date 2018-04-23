"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const emptyChildren = Object.freeze([]);
class GpParentNodeImpl extends node_1.default {
    constructor() {
        super(...arguments);
        this._children = emptyChildren;
    }
    hasChildren() {
        return this._children.length > 0;
    }
    getChildren() {
        return this._children;
    }
    removeChild(child) {
        this._children = this._children.filter((o) => o !== child);
    }
    appendChild(child) {
        child.setParent(this);
        this._children = [...this._children, child];
    }
    isContainer() {
        return true;
    }
}
exports.default = GpParentNodeImpl;
//# sourceMappingURL=parent-node.js.map