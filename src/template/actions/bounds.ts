import {RectangleLike} from "core/types";

export const BoundsAction = {
  $type: boundsActionFactory,
  $name: 'bounds-bind',
  $ftype: 'self',
}

function boundsActionFactory() {
  return boundsAction;
}

function boundsAction(el: SVGElement, gp: RectangleLike): void {
  el.setAttribute("height", <any>(gp.height));
  el.setAttribute("width", <any>(gp.width));
  el.setAttribute("x", <any>(gp.x));
  el.setAttribute("y", <any>(gp.y));
}
