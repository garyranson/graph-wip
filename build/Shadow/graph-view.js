"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const template_library_1 = require("../Templates/template-library");
class GpGraphViewImpl {
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
            e.refresh();
        });
        this.create = Dooer(this.trigger, (context) => {
            if (this.map.get(context.getId()))
                return;
            let px = context.getParent();
            while (px && !this.map.get(px.getId())) {
                context = px;
                px = px.getParent();
            }
            const instance = this.buildTree(context);
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
            e.refresh();
        });
        this.container = svg;
    }
    appendNodeView(view) {
        if (!view)
            return;
        this.container.appendChild(view.getRoot());
    }
    getContainer() {
        return this.container;
    }
    buildTree(node) {
        //Check if we already have the instance
        let instance = this.map.get(node.getId());
        if (!instance) {
            instance = template_library_1.default.createView(node);
            this.map.set(node.getId(), instance);
            if (node.hasChildren()) {
                for (const child of node.getChildren()) {
                    instance.appendChild(this.buildTree(child));
                }
            }
        }
        return instance;
    }
    initialize(layers) {
        layers
            .map((layer) => this.buildTree(layer))
            .forEach(i => this.container.appendChild(i.getRoot()));
    }
    getInstance(id) {
        return this.map.get(id);
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
}
exports.default = GpGraphViewImpl;
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
window.addEventListener('resize', resize);
function resize() {
    console.log('resize');
}
//# sourceMappingURL=graph-view.js.map