import {RectangleLike} from "core/types";

export const CanvasAction = {
  $type: canvasActionFactory,
  $name: 'canvas',
  $item: 'self'
}

function canvasActionFactory() {
  return canvasAction;
}

function canvasAction(el: SVGGraphicsElement, gp: RectangleLike): void {
  el.setAttribute("x", "0");
  el.setAttribute("y", "0");
  el.setAttribute("width", (<any>gp.width));
  el.setAttribute("height", (<any>gp.height));
}
