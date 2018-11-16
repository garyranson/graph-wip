import {lineMidPoint} from "core/geometry";

export const ConnectorXyAction = {
  $type: connectorFactory,
  $name: 'connector-xy',
  $ftype: 'self',
}

function connectorFactory() {
  return connectorXY;
}
function connectorXY(el: SVGElement, gp: any): void {
  const mp = lineMidPoint({x: gp.x1, y: gp.y1}, {x: gp.x2, y: gp.y2})
  el.setAttribute("x", (<any>mp.x));
  el.setAttribute("y", (<any>mp.y));
}
