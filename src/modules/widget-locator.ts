import {WidgetAttributes} from "core/types";

export type WidgetLocator = (node: Element) => WidgetAttributes;

export const WidgetLocatorModule = {
  $type: WidgetLocator,
  $inject: ['Container'],
  $name: 'WidgetLocator'
}

function WidgetLocator(rootElement: Element): WidgetLocator {
  let targetElement: Element = null;
  let currentNodeEvent: WidgetAttributes = null;
  let matchedElement: Element = null;

  return function cellFinder(element: Element): WidgetAttributes {

    if (element === targetElement) return currentNodeEvent;
    targetElement = element;

    while (element) {
      if (element === matchedElement) {
        return currentNodeEvent;
      }

      let nodeId = element === rootElement ? '0' : element.getAttribute("pxnode");

      if (nodeId) {
        matchedElement = element;

        currentNodeEvent = {
          id: nodeId,
          action: element.getAttribute("pxaction"),
          data: element.getAttribute("pxdata")
        };

        return currentNodeEvent;
      }
      element = element.parentElement;
    }
    matchedElement = null;
    return null;
  }
}

export const emptyLocator = Object.freeze({id: null, action: null, data: null});
