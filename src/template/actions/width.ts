import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const WidthAction = {
  $name: 'width-bind',
  $type: 'simple',
  $expr: widthFactoryV,
  $constant: widthFactoryC
}
function widthFactoryC(o: any[]) {
  const offset = o[0] || 0;
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("width", <any>(gp.width + offset));
  };
}

function widthFactoryV(o: CompiledFunction[]) {
  const offset = o[0];
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("width", <any>(gp.width + offset(gp)));
  };
}
