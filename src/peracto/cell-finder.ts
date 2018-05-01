import {GpGraphView, GpNodeView, GraphGestureEvent} from "../types";

export default function CellFinder(graphView: GpGraphView, emptyGestureEvent: GraphGestureEvent) : (node:Element) => GraphGestureEvent {
  let targetElement: Element;
  let currentNodeEvent: GraphGestureEvent = emptyGestureEvent;
  let matchedElement: Element;
  let targetNodeId: any;
  let targetNodeView: GpNodeView;
  let rootElement: Element = graphView.getContainer();

  return function updateTargetCell(element: Element) : GraphGestureEvent {
    if (element == targetElement) return currentNodeEvent;
    targetElement = element;

    while (element) {
      if (element == matchedElement) {
        return currentNodeEvent;
      }

      let nodeId = element==rootElement?'0':element.getAttribute("pxnode");

      if (nodeId) {
        matchedElement = element; 

        if (targetNodeId != nodeId) {
          targetNodeView = graphView.getInstance(parseInt(nodeId));
          targetNodeId = nodeId;
        }

        currentNodeEvent = {
          nodeView: targetNodeView,
          nodeId: nodeId,
          node: targetNodeView ? targetNodeView.getNode() : null,
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
  }
}
