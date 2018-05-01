"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cell_finder_1 = require("./cell-finder");
const event_1 = require("./event");
const node_action_library_1 = require("../node-action/node-action-library");
const emptyGestureEvent = Object.freeze({
    nodeView: null,
    node: null,
    nodeId: null,
    action: null,
    data: null
});
class GestureHandler {
    constructor(graph) {
        this.graph = graph;
        this.currentEvent = emptyGestureEvent;
        this.currentAction = node_action_library_1.default.get('mover');
        this.onOver = new event_1.default();
        this.finder = cell_finder_1.default(graph, emptyGestureEvent);
    }
    over(element) {
        const currentEvent = this.finder(element);
        if (currentEvent != this.currentEvent) {
            const previousEvent = this.currentEvent;
            console.log('element changes', currentEvent, previousEvent);
            if (previousEvent && previousEvent.node != currentEvent.node) {
                console.log('fire');
                this.onOver.fire({ current: currentEvent, previous: previousEvent });
            }
            else {
                console.log('matches???', previousEvent.node, currentEvent.node);
            }
            this.currentAction = node_action_library_1.default.get(currentEvent.action || 'canvas');
            this.currentEvent = currentEvent;
        }
        if (!this.currentEvent.action) {
            console.log(element);
        }
        console.log('action:' + this.currentEvent.action);
        return this.currentAction;
    }
    createDragHandler(e) {
        this.onOver.fire(null);
        return this.currentAction.createDragHandler(this.graph, this.currentEvent, e);
    }
    clickHandler(clickCount, e) {
        if (this.currentAction.canClick()) {
            this.currentAction.tap(this.graph, clickCount, this.currentEvent, e);
        }
    }
    down(e) {
        this.currentAction.down(this.graph, this.currentEvent, e);
    }
    getCurrentAction() {
        return this.currentAction;
    }
}
exports.default = GestureHandler;
//# sourceMappingURL=gesture-handler.js.map