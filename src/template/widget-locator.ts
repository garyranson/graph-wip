import {WidgetAttributes} from "core/types";

export type WidgetLocator = (node: Element) => WidgetAttributes;

export const WidgetLocatorModule = {
  $type: WidgetLocator,
  $inject: [],
  $name: 'WidgetLocator'
}

function WidgetLocator(): WidgetLocator {
  let targetElement: Element = null;
  let currentNodeEvent: WidgetAttributes = null;
  let matchedElement: Element = null;

  return function cellFinder(element: Element): WidgetAttributes {

    if (element === targetElement)
      return currentNodeEvent;

    targetElement = element;

    for (let el = element; el; el = el.parentElement) {
      if (el === matchedElement)
        return currentNodeEvent;

      const id = el.getAttribute("pxnode");

      if (!id) continue;

      matchedElement = el;

      return currentNodeEvent = {
        id: id,
        action: el.getAttribute("pxaction"),
        data: el.getAttribute("pxdata")
      };
    }
    return matchedElement = null;
  }
}

export const emptyLocator = Object.freeze({id: null, action: null, data: null});
