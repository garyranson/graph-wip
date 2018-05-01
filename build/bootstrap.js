"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
///<reference path="peracto/gesture-handler.ts"/>
const dom_gesture_handler_1 = require("./peracto/dom-gesture-handler");
const gesture_handler_1 = require("./peracto/gesture-handler");
const graph_1 = require("./Shadow/graph");
const graph_view_1 = require("./Shadow/graph-view");
const node_highlighter_1 = require("./peracto/node-highlighter");
function default_1(container) {
    const doc = graph_1.default.create();
    const view = new graph_view_1.default(container);
    doc.bindView(view);
    const highlighter = new node_highlighter_1.default(view);
    const handler = new gesture_handler_1.default(view);
    handler.onOver.add(highlighter.action.bind(highlighter));
    dom_gesture_handler_1.default(container, handler);
    // const rootNode = doc.createContainerObject("rootNode", 0, 0, 3000, 1000);
    const root = doc.getRoot();
    const objset = [];
    for (let i = 0; i < 10; i++) {
        const x = Math.round(Math.random() * 1500);
        const y = Math.round(Math.random() * 1200);
        const r = Math.round(Math.random() * 5) * 10;
        const q = Math.round(Math.random() * 5) * 10;
        const box1 = doc.createObject("default", x, y, 150 + r, 100 + q);
        root.appendChild(box1);
        objset.push(box1);
    }
    let s = 10;
    setInterval(() => {
        //const s = 1 + Math.round(Math.random() * 3);
        s = ((s + 1) % 25);
        s = 10;
        for (const o of objset) {
            const x = Math.random() * 2500;
            const y = Math.random() * 1200;
            highlighter.action(null);
            o.setLocation(x, y);
            o.setSize((s * 8) + 20, (s * 8) + 20);
        }
    }, 300000);
}
exports.default = default_1;
//# sourceMappingURL=bootstrap.js.map