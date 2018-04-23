System.register([], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var GpNodeViewImpl;
    return {
        setters: [],
        execute: function () {
            GpNodeViewImpl = class GpNodeViewImpl {
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
            };
            exports_1("default", GpNodeViewImpl);
        }
    };
});
//# sourceMappingURL=template-instance.js.map