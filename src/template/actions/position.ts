import {RectangleLike} from "core/types";

export const PositionAction = {
  $name: 'position-bind',
  $type: 'self',
  $constant: positionFactory
}

function positionFactory(o: any) {
  return positionAction;
}

function positionAction(el: SVGGraphicsElement, gp: RectangleLike): void {
  el.setAttribute("transform", `translate(${gp.x},${gp.y})`);
}
