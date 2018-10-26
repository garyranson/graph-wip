import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";
export const BorderAction = {
  $name: 'border-bind',
  $type: 'simple',
  $expr: borderFactoryV,
  $constant: borderFactoryC
}
function borderFactoryC(o: any[]) {
  const offset = o[0] || 0;
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("x", <any>(-offset));
    el.setAttribute("y", <any>(-offset));
    el.setAttribute("width", <any>(gp.width + offset + offset));
    el.setAttribute("height", <any>(gp.height + offset + offset));
  };
}

function borderFactoryV(o: CompiledFunction[]) {
  const [_offset] = o;
  return (el: SVGElement, gp: RectangleLike): void => {
    const offset = _offset(gp) || 0;
    el.setAttribute("x", <any>(-offset));
    el.setAttribute("y", <any>(-offset));
    el.setAttribute("width", <any>(gp.width + offset + offset));
    el.setAttribute("height", <any>(gp.height + offset + offset));
  };
}
