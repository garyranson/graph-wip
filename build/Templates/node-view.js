"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GpNodeViewImpl {
    constructor(root, exec, context) {
        this.root = root;
        this.exec = exec;
        this.context = context;
    }
    appendChild(child) {
        if (child) {
            this.root.appendChild(child.getRoot());
        }
    }
    remove() {
        this.root.remove();
    }
    getRoot() {
        return this.root;
    }
    getNode() {
        return this.context;
    }
    refresh() {
        this.exec(this.context);
    }
    addClass(name) {
        this.root.classList.add(name);
    }
    removeClass(name) {
        this.root.classList.remove(name);
    }
}
exports.default = GpNodeViewImpl;
//# sourceMappingURL=node-view.js.map