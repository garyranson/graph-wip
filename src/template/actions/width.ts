import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const WidthAction = {
  $type: widthFactory,
  $name: 'width',
  $ftype: 'expr',
}

function widthFactory(constant: boolean, args: any[]) {
  return constant
    ? !args || !args.length || args[0] == 0
      ? widthNoParams
      : widthFactoryC(args)
    : widthFactoryV(args);
}

function widthNoParams(el: SVGElement, gp: RectangleLike): void {
  el.setAttribute("width", <any>gp.width);
};

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
