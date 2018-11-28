import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const HeightAction = {
  $type: heightFactory,
  $name: 'height',
  $item: 'expr',
}

function heightFactory(constant: boolean, args: any[]) {
  return constant
    ? !args || !args.length || args[0] == 0
      ? heightNoParams
      : heightFactoryC(args)
    : heightFactoryV(args);
}

function heightNoParams(el: SVGElement, gp: RectangleLike): void {
  el.setAttribute("height", <any>gp.height);
};

function heightFactoryC(o: any[]) {
  const offset = o[0] || 0;
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("height", <any>(gp.height + offset));
  };
}

function heightFactoryV(o: CompiledFunction[]) {
  const offset = o[0];
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("height", <any>(gp.height + (offset(gp)||0)));
  };
}
