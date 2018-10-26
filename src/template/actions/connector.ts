export const ConnectorAction = {
  $name: 'connector',
  $type: 'simple',
  $expr: connectorFactory,
  $constant: connectorFactory
}

function connectorFactory() {
  return (el: SVGElement, gp: any): void => {
    el.setAttribute("x1", <any>(gp.x1));
    el.setAttribute("y1", <any>(gp.y1));
    el.setAttribute("x2", <any>(gp.x2));
    el.setAttribute("y2", <any>(gp.y2));
  };
}
