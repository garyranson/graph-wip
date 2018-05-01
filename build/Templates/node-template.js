"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exec_reducer_1 = require("./exec-reducer");
const action_reducer_1 = require("./action-reducer");
const node_view_1 = require("./node-view");
const parse_svg_1 = require("./parse-svg");
const dom_1 = require("../Utils/dom");
const actions_1 = require("./actions");
class GpTemplateImpl {
    constructor(svg) {
        const root = parse_svg_1.default(svg);
        this.instructions = compileActions(root);
        this.template = finalizeElement(root);
    }
    createView(node) {
        const root = this.template.cloneNode(true);
        const nodeId = node.getId();
        root.setAttribute('pxnode', nodeId);
        const actions = root.querySelectorAll('[pxaction]');
        for (let i = 0; i < actions.length; i++) {
            actions.item(i).setAttribute('pxnode', nodeId);
        }
        const rc = exec_reducer_1.default(getMappedElements(root), this.instructions);
        rc(node);
        return new node_view_1.default(root, rc, node);
    }
}
exports.default = GpTemplateImpl;
function getBoundAttributes(root) {
    const pat = [];
    for (const el of dom_1.default.getNodes(root, NodeFilter.SHOW_ELEMENT)) {
        const attrs = el.attributes;
        let x;
        for (let i = 0; i < attrs.length; i++) {
            const factory = actions_1.findAction(attrs[i].name);
            if (factory) {
                if (!x) {
                    x = { el, attrs: [] };
                    pat.push(x);
                }
                x.attrs.push({
                    name: attrs[i].name,
                    factory
                });
            }
        }
    }
    return pat;
}
function compileActions(root) {
    return getBoundAttributes(root).map((v, i) => {
        v.el.setAttribute("GP__MAP__", i);
        const av = action_reducer_1.default(v.attrs.map((a) => {
            const value = v.el.getAttribute(a.name);
            v.el.removeAttribute(a.name);
            return a.factory(value);
        }));
        return av;
    });
}
function finalizeElement(root) {
    const list = root.querySelectorAll('[data-gp]');
    for (let i = 0; i < list.length; i++) {
        const node = list.item(i);
        const values = node.getAttribute('data-gp').trim().split(':').map(s => s.trim());
        if (values[0] != undefined)
            node.setAttribute('pxaction', values[0]);
        if (values[1] != undefined)
            node.setAttribute('pxdata', values[1]);
        node.removeAttribute('data-gp');
    }
    return root.firstElementChild.cloneNode(true);
}
function getMappedElements(root) {
    const a = [];
    const q = root.getAttribute('GP__MAP__');
    if (q) {
        a[parseInt(q)] = root;
        root.removeAttribute('GP__MAP__');
    }
    const list = root.querySelectorAll('[GP__MAP__]');
    for (let i = 0; i < list.length; i++) {
        const node = list.item(i);
        a[parseInt(node.getAttribute('GP__MAP__'))] = node;
        node.removeAttribute('GP__MAP__');
    }
    return a;
}
//# sourceMappingURL=node-template.js.map