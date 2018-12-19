import {EdgeState, PointLike} from "core/types";

export const ConnectorPathAction = {
  $type: connectorPathFactory,
  $name: 'connector-path',
  $item: 'self',
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

  if (route) {
    path = route.reduce((a,pt) => a+` L${pt.x},${pt.y}`,path);
/*
    for (let index = 1, n = route.length-1; index < n; index++) {
      const pt = route[index];
      path += ` L${pt.x},${pt.y}`;
    }
*/
  }

  return path + ` L${gp.x2},${gp.y2}`;
}
