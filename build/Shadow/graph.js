"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = require("./node");
const parent_node_1 = require("./parent-node");
class GpGraphImpl {
    constructor() {
        this.id = 0;
        this.id = 0;
        this.rootNode = new parent_node_1.default(this, "$node-root", 0, 0, 2000, 2000);
    }
    getRoot() {
        return this.rootNode;
    }
    static create() {
        return new GpGraphImpl();
    }
    bindView(view) {
        this.view = view;
        view.initialize([
            this.rootNode
        ]);
    }
    createId() {
        return this.id++;
    }
    createObject(template, x, y, width, height) {
        return new node_1.default(this, template, x, y, width, height);
    }
    createContainerObject(template, x, y, width, height) {
        return new parent_node_1.default(this, template, x, y, width, height);
    }
    triggerResize(obj) {
        if (this.view)
            this.view.triggerResize(obj);
    }
    triggerCreate(obj) {
        if (this.view)
            this.view.triggerCreate(obj);
    }
    triggerMove(obj) {
        if (this.view)
            this.view.triggerMove(obj);
    }
    triggerDelete(obj) {
        if (this.view)
            this.view.triggerDelete(obj);
    }
}
exports.default = GpGraphImpl;
//# sourceMappingURL=graph.js.map