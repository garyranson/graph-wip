import {RectangleLike} from "core/types";

export const BoundsAction = {
  $name: 'bounds-bind',
  $type: 'self',
  $constant: boundsFactoryFactory
}
function boundsFactoryFactory() {
  return boundsFactory;
}

function boundsFactory(el: SVGElement, gp: RectangleLike): void {
  el.setAttribute("height", <any>(gp.height));
  el.setAttribute("width", <any>(gp.width));
  el.setAttribute("x", <any>(gp.x));
  el.setAttribute("y", <any>(gp.y));
}
