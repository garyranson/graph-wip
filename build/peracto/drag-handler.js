"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cell_finder_1 = require("./cell-finder");
const emptyGestureEvent = Object.freeze({
    instance: null,
    context: null,
    nodeId: null,
    action: null,
    data: null
});
class DragHandlerBase {
    constructor(graph, data) {
        this.currentEvent = emptyGestureEvent;
        this.finder = cell_finder_1.default(graph, emptyGestureEvent);
        this.graph = graph;
        this.state = data.instance;
        this.cell = data.context;
        this.cellId = data.nodeId;
        this.currentEvent = data;
    }
    init(data) {
    }
    start(e, data) {
    }
    move(e) {
        console.log(`drag:${e.clientX}:${e.clientY}`);
    }
    drop(e) {
        console.log(`drop:${e.clientX}:${e.clientY}`);
    }
    targetChange(curr, prev) {
    }
    getState() {
        return this.state;
        //return this.currentEvent.cellState;
    }
    over(e) {
        console.log(e.relatedTarget);
        const currentEvent = this.finder(e.relatedTarget);
        if (currentEvent != this.currentEvent) {
            console.log('Drag element changed', currentEvent);
            const prev = this.currentEvent;
            this.currentEvent = currentEvent;
            this.targetChange(currentEvent, prev);
        }
    }
    cancel() {
    }
}
exports.default = DragHandlerBase;
//# sourceMappingURL=drag-handler.js.map