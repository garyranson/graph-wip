"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const svg_1 = require("../Utils/svg");
class GpNodeResizeHandler {
    constructor(graph, data) {
        //    this.index = parseInt(data.data);
        this.graph = graph;
        this.data = data;
    }
    init(data) {
    }
    start(e, data) {
        //this.inTolerance = true;
        this.childOffsetX = 0;
        this.childOffsetY = 0;
        this.startX = data.pointerX;
        this.startY = data.pointerY;
        const node = this.data.context;
        this.shadowNode = svg_1.createSvgElement('rect', {
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
            style: 'stroke-width:4;fill:none,stroke:black',
        });
        this.graph.getContainer().appendChild(this.shadowNode);
    }
    move(e) {
    }
    cancel() {
    }
    drop(e) {
    }
    getState() {
        return undefined;
    }
    over(e) {
    }
    targetChange(curr, prev) {
    }
}
exports.default = GpNodeResizeHandler;
//# sourceMappingURL=node-resizer-handler.js.map