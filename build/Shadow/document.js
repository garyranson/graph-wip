System.register(["../Templates/template-instance", "../Templates/template-library", "./node", "./parent-node"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function Dooer(setter, action) {
        let set;
        return {
            add,
            fire
        };
        function add(o) {
            if (!set) {
                set = new Set();
                setter();
            }
            set.add(o);
        }
        function fire() {
            if (set) {
                set.forEach(action);
                set = null;
            }
        }
    }
    function Trigger(action) {
        let trigger = 0;
        return () => {
            if (trigger == 0) {
                trigger = window.requestAnimationFrame(fire);
            }
        };
        function fire() {
            action();
            trigger = 0;
        }
    }
    function createRoot(svg) {
        return function (o) {
            svg.setAttribute("width", o.width);
            svg.setAttribute("height", o.height);
        };
    }
    function resize() {
        console.log('resize');
    }
    var template_instance_1, template_library_1, node_1, parent_node_1, GpGraph;
    return {
        setters: [
            function (template_instance_1_1) {
                template_instance_1 = template_instance_1_1;
            },
            function (template_library_1_1) {
                template_library_1 = template_library_1_1;
            },
            function (node_1_1) {
                node_1 = node_1_1;
            },
            function (parent_node_1_1) {
                parent_node_1 = parent_node_1_1;
            }
        ],
        execute: function () {
            GpGraph = class GpGraph {
                constructor(svg) {
                    this.map = new Map();
                    this.trigger = Trigger(() => {
                        this.delete.fire();
                        this.create.fire();
                        this.resize.fire();
                        this.move.fire();
                    });
                    this.resize = Dooer(this.trigger, (o) => {
                        const e = this.map.get(o.getId());
                        if (!e)
                            return;
                        e.exec(o);
                    });
                    this.create = Dooer(this.trigger, (context) => {
                        let instance = this.map.get(context.getId());
                        if (instance)
                            return;
                        instance = template_library_1.default.getTemplate(context.template).create(context);
                        this.map.set(context.getId(), instance);
                        instance.exec(context);
                        const parent = context.getParent();
                        this.map.get(parent.getId()).appendChild(instance);
                    });
                    this.delete = Dooer(this.trigger, (o) => {
                        const e = this.map.get(o.getId());
                        if (e) {
                            e.remove();
                            this.map.delete(o.getId());
                        }
                    });
                    this.move = Dooer(this.trigger, (o) => {
                        const e = this.map.get(o.getId());
                        if (!e)
                            return;
                        e.exec(o);
                    });
                    this.container = svg;
                    this.id = 0;
                    const root = new parent_node_1.default(this, "root", 0, 0, 1000, 1000);
                    const ti = new template_instance_1.default(svg, createRoot(svg), root);
                    ti.exec(root);
                    // svg.appendChild(svg);
                    this.map.set(root.getId(), ti);
                    this.root = root;
                    svg.addEventListener("mouseout", (e) => {
                        console.log(e.relatedTarget);
                    });
                }
                getInstance(id) {
                    return this.map.get(id);
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
                    this.resize.add(obj);
                }
                triggerCreate(obj) {
                    this.create.add(obj);
                }
                triggerMove(obj) {
                    this.move.add(obj);
                }
                triggerDelete(obj) {
                    this.delete.add(obj);
                }
            };
            exports_1("default", GpGraph);
            window.addEventListener('resize', resize);
        }
    };
});
//# sourceMappingURL=document.js.map