import {lineMidPoint} from "core/geometry";

export const ConnectorXyAction = {
  $name: 'connector-xy',
  $type: 'self',
  $constant: connectorXY
}

function connectorXY(o: any) {
  return (el: SVGElement, gp: any): void => {
    const mp = lineMidPoint({x: gp.x1, y: gp.y1}, {x: gp.x2, y: gp.y2})
    el.setAttribute("x", (<any>mp.x));
    el.setAttribute("y", (<any>mp.y));
  };
}
