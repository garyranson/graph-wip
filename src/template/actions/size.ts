import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const SizeAction = {
  $name: 'size-bind',
  $type: 'simple',
  $expr: sizeFactoryV,
  $constant: sizeFactoryC
}

function sizeFactoryC(o: any[]) {
  const wOffset = o[0] || 0;
  const hOffset = o[1] || wOffset;

  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("width", <any>(gp.width + wOffset));
    el.setAttribute("height", <any>(gp.height + hOffset));
  };
}

function sizeFactoryV(o: CompiledFunction[]) {
  const wOffset = o[0];
  const hOffset = o[1] || wOffset;

  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("width", <any>(gp.width + (wOffset(gp) || 0)));
    el.setAttribute("height", <any>(gp.height + (hOffset(gp) || 0)));
  };
}
