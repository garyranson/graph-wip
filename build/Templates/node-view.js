"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GpNodeViewImpl {
    constructor(root, exec, context) {
        this.element = root;
        this.exec = exec;
        this.node = context;
    }
    appendChild(child) {
        if (child) {
            this.element.appendChild(child.getRoot());
        }
    }
    remove() {
        this.element.remove();
    }
    getRoot() {
        return this.element;
    }
    getNode() {
        return this.node;
    }
    refresh() {
        this.exec(this.node);
    }
    addClass(name) {
        this.element.classList.add(name);
        return this;
    }
    removeClass(name) {
        this.element.classList.remove(name);
        return this;
    }
    setAttribute(name, value) {
        this.element.setAttribute(name, value);
        return this;
    }
}
exports.default = GpNodeViewImpl;
//# sourceMappingURL=node-view.js.map