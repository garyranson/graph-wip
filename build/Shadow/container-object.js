System.register(["./node"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var node_1, emptyChildren, GpParentNode;
    return {
        setters: [
            function (node_1_1) {
                node_1 = node_1_1;
            }
        ],
        execute: function () {
            emptyChildren = Object.freeze([]);
            GpParentNode = class GpParentNode extends node_1.default {
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
            };
            exports_1("default", GpParentNode);
        }
    };
});
//# sourceMappingURL=container-object.js.map