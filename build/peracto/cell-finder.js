"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function CellFinder(graphView, emptyGestureEvent) {
    let targetElement;
    let currentNodeEvent = emptyGestureEvent;
    let matchedElement;
    let targetNodeId;
    let targetNodeView;
    let rootElement = graphView.getContainer();
    return function updateTargetCell(element) {
        if (element == targetElement)
            return currentNodeEvent;
        targetElement = element;
        while (element && element != rootElement) {
            if (element == matchedElement) {
                return currentNodeEvent;
            }
            let nodeId = element.getAttribute("pxnode");
            if (nodeId) {
                matchedElement = element;
                if (targetNodeId != nodeId) {
                    targetNodeView = graphView.getInstance(parseInt(nodeId));
                    targetNodeId = nodeId;
                }
                currentNodeEvent = {
                    instance: targetNodeView,
                    nodeId: nodeId,
                    context: targetNodeView ? targetNodeView.getNode() : null,
                    action: element.getAttribute("pxaction"),
                    data: element.getAttribute("pxdata")
                };
                return currentNodeEvent;
            }
            element = element.parentElement;
        }
        currentNodeEvent = emptyGestureEvent;
        matchedElement = null;
        return currentNodeEvent;
    };
}
exports.default = CellFinder;
//# sourceMappingURL=cell-finder.js.map