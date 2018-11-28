import {LineLike, RectangleLike} from "core/types";
import {computeAngle} from "core/geometry";

export const TextTemplateAction = {
  $type: textTemplateFactory,
  $name: 'text-template',
  $item: 'self'
}

function textTemplateFactory(expr: string) {
  return formatLibrary[expr] || formatInvalid;
}

function formatInvalid(el: SVGElement): void {
  el.textContent = `???`;
}

const formatLibrary = {
  point: (el: SVGElement, gp: RectangleLike): void => {
    el.textContent = `[${Math.round(gp.x)},${Math.round(gp.y)}]`;
  },
  ppoint: (el: SVGElement, gp: LineLike): void => {
    el.textContent = `[${Math.round(gp.x1)},${Math.round(gp.y1)}]`;
  },
  size: (el: SVGElement, gp: RectangleLike): void => {
    el.textContent = `[${gp.width},${gp.height}]`;
  },
  angle: (el: SVGElement, gp: any): void => {
    el.textContent = `[${Math.round(computeAngle({x: gp.x1, y: gp.y1}, {x: gp.x2, y: gp.y2}))}]`;
  }
}
