"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cell_finder_1 = require("./cell-finder");
const template_library_1 = require("../Templates/template-library");
//import GpNodeResizeHandler from "./node-resizer-handler";
const emptyGestureEvent = Object.freeze({
    instance: null,
    context: null,
    nodeId: null,
    action: null,
    data: null
});
class CellMoverHub {
    canClick() {
        return true;
    }
    canDrag() {
        return true;
    }
    getDragTolerance() {
        return 0;
    }
    startDrag() {
    }
    createDragHandler(evt) {
        return null; //new DragHandler();
    }
    tap(e, x) {
        console.log(`Click fired ${x.tapCount} times`);
    }
}
const actionCache = new Map([
    ["mover", new CellMoverHub()]
]);
class GestureHandler {
    constructor(graph) {
        this.currentEvent = emptyGestureEvent;
        this.graph = graph;
        this.finder = cell_finder_1.default(graph, emptyGestureEvent);
        this.highlighter = new Highlighter(graph);
    }
    getCurrentAction() {
        return actionCache.get("mover");
    }
    over(evt) {
        const currentEvent = this.finder(evt.relatedTarget);
        if (currentEvent != this.currentEvent) {
            console.log(`Something has changed:${currentEvent.nodeId}:${currentEvent.action}:${currentEvent.data}`);
            const previousEvent = this.currentEvent;
            if (previousEvent && previousEvent.context != currentEvent.context) {
                this.highlighter.off(previousEvent.context);
                this.highlighter.on(currentEvent.context);
            }
            this.currentEvent = currentEvent;
        }
    }
    getDragTolerance(e) {
        if (this.currentEvent.action == 'canvas') {
            return 0;
        }
        return 10;
    }
    createDragHandler(e) {
        if (this.currentEvent.action == 'resizer') {
            //return new GpNodeResizeHandler(this.graph,this.currentEvent);
        }
        return null;
    }
    createHoverHandler(e) {
        return null;
    }
}
exports.default = GestureHandler;
class Highlighter {
    constructor(graphView) {
        this.highlights = new Map();
        this.graphView = graphView;
    }
    on(node) {
        if (!node)
            return;
        const nodeId = node.getId();
        const obj = this.highlights.get(nodeId);
        const element = this.graphView.getInstance(nodeId);
        element.addClass('hover');
        if (obj) {
            if (obj.timer) {
                clearTimeout(obj.timer);
                obj.timer = 0;
            }
            obj.view.removeClass('gpFade');
        }
        else {
            const view = template_library_1.default.createView(node, 'outline');
            this.graphView.appendNodeView(view);
            this.highlights.set(nodeId, {
                view,
                timer: 0
            });
        }
    }
    off(node) {
        if (!node)
            return;
        const nodeId = node.getId();
        const obj = this.highlights.get(nodeId);
        const element = this.graphView.getInstance(nodeId);
        element.removeClass('hover');
        if (!obj && obj.timer)
            return;
        obj.view.addClass('gpFade');
        obj.timer = setTimeout(() => {
            const obj = this.highlights.get(nodeId);
            if (!obj)
                return;
            this.highlights.delete(nodeId);
            obj.view.remove();
        }, 500);
    }
}
//# sourceMappingURL=gesture-handler.js.map