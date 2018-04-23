System.register(["./actions", "./exec-reducer", "./action-reducer", "./node-view"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function create(svg) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="__root__">${svg}</svg>`, 'text/html');
        const root = doc.getElementById("__root__");
        root.normalize();
        //Remove comments
        getNodes(root, NodeFilter.SHOW_COMMENT).forEach(n => n.parentNode.removeChild(n));
        return root;
    }
    function getActions(root) {
        const actions = [];
        getBoundAttributes(root).forEach((v, i) => {
            const av = [];
            for (const a of v.attrs) {
                const p = a.name.indexOf('.');
                const name = a.name.substr(0, p).toLowerCase();
                //const type = a.name.substr(p+1).toLowerCase();
                v.el.removeAttribute(a.name);
                const binder = actions_1.bindMap[name];
                if (binder) {
                    av.push(binder(a.value));
                }
            }
            if (av.length > 0) {
                v.el.setAttribute("GP__MAP__", actions.length);
                actions.push(action_reducer_1.default(av));
            }
        });
        return actions;
    }
    function getNodes(root, whatToShow) {
        const tw = document.createTreeWalker(root, whatToShow);
        const a = [];
        while (tw.nextNode())
            a.push(tw.currentNode);
        return a;
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
    function getBoundAttributes(root) {
        const pat = [];
        for (const el of getNodes(root, NodeFilter.SHOW_ELEMENT)) {
            const attrs = el.attributes;
            let x;
            for (let i = 0; i < attrs.length; i++) {
                if (attrs[i].name.indexOf('.') > 0) {
                    if (!x) {
                        x = { el, attrs: [] };
                        pat.push(x);
                    }
                    x.attrs.push(attrs[i]);
                }
            }
        }
        return pat;
    }
    var actions_1, exec_reducer_1, action_reducer_1, node_view_1, GpTemplateImpl;
    return {
        setters: [
            function (actions_1_1) {
                actions_1 = actions_1_1;
            },
            function (exec_reducer_1_1) {
                exec_reducer_1 = exec_reducer_1_1;
            },
            function (action_reducer_1_1) {
                action_reducer_1 = action_reducer_1_1;
            },
            function (node_view_1_1) {
                node_view_1 = node_view_1_1;
            }
        ],
        execute: function () {
            GpTemplateImpl = class GpTemplateImpl {
                constructor(svg) {
                    const root = create(svg);
                    this.instructions = getActions(root);
                    this.template = root.firstElementChild.cloneNode(true);
                }
                createView(context) {
                    const root = this.template.cloneNode(true);
                    root.setAttribute('PxNode', context.getId());
                    const rc = exec_reducer_1.default(getMappedElements(root), this.instructions);
                    rc(context);
                    return new node_view_1.default(root, rc, context);
                }
            };
            exports_1("default", GpTemplateImpl);
        }
    };
});
//# sourceMappingURL=template.js.map