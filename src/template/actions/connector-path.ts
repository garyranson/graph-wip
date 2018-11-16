import {EdgeState, PointLike} from "core/types";
import {lineLength, movePoint} from "core/geometry";

export const ConnectorPathAction = {
  $type: connectorPathFactory,
  $name: 'connector-path',
  $ftype: 'self',
}


function connectorPathFactory() {
  return connectorPathAction;
}

function connectorPathAction(el: SVGElement, gp: any): void {
  el.setAttribute('d', roundedConnector(gp));
}

function roundedConnector(gp: EdgeState): string {
  const route: PointLike[] = gp.route;

  let path = `M${gp.x1},${gp.y1}`;

  if (route && route.length) {
    const offset = 10;
    const _13 = 1 / 3;
    const _23 = 2 / 3;

    let curr = route[0];
    const final = {x: gp.x2, y: gp.y2};
    let prev = {x: gp.x1, y: gp.y1};
    let prevDistance = (lineLength(curr, prev) / 2);

    for (let index = 0, n = route.length; index < n; index++) {
      const next = route[index + 1] || final;
      const nextDistance = lineLength(curr, next) / 2;
      const roundedStart = movePoint(curr, prev, -Math.min(offset, prevDistance));
      const roundedEnd = movePoint(curr, next, -Math.min(offset, nextDistance));

      const control1 = {x: (_13 * roundedStart.x) + (_23 * curr.x), y: (_23 * curr.y) + (_13 * roundedStart.y)};
      const control2 = {x: (_13 * roundedEnd.x) + (_23 * curr.x), y: (_23 * curr.y) + (_13 * roundedEnd.y)};

      path += ` L${roundedStart.x},${roundedStart.y} C${control1.x} ${control1.y},${control2.x} ${control2.y}, ${roundedEnd.x} ${roundedEnd.y}`;
      //path += ` L${curr.x},${curr.y}`;

      prev = curr;
      curr = next;
      prevDistance = nextDistance;
    }
  }

  return path + ` L${gp.x2},${gp.y2}`;
}
