"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drag_handler_base_1 = require("../peracto/drag-handler-base");
const template_library_1 = require("../Templates/template-library");
class ResizerDragHandler extends drag_handler_base_1.default {
    init(data) {
        this.shadow = createShadow(this.getSourceNode());
        this.dragObject = this.getGraphView().appendNodeView(template_library_1.default
            .createView(this.shadow, 'dragoutline')
            .setAttribute('transform', `translate(0,0)`));
    }
    move(dx, dy, e) {
        this.dragObject.setAttribute('transform', `translate(${dx},${dy})`);
    }
    drop(dx, dy, e) {
        const node = this.getSourceNode();
        setTimeout(() => {
            node.setLocation(node.x + dx, node.y + dy);
        }, 10);
    }
    cancel() {
        if (this.dragObject) {
            this.dragObject.remove();
            this.dragObject = null;
        }
    }
}
exports.default = ResizerDragHandler;
function createShadow(node) {
    function shadow() {
    }
    shadow.prototype = node;
    return new shadow();
}
//# sourceMappingURL=node-resizer-handler.js.map