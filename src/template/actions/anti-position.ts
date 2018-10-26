import {RectangleLike} from "core/types";
export const AntiPositionAction = {
  $name: 'anti-position',
  $type: 'self',
  $constant: antiPositionFactory
}

function antiPositionFactory(o: any) {
  return antiPositionAction;
}

function antiPositionAction(el: SVGGraphicsElement, gp: RectangleLike): void {
  el.setAttribute("transform", `translate(${-gp.x},${-gp.y})`);
};
