import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const SizeAction = {
  $type: sizeFactory,
  $name: 'size',
  $item: 'expr',
}

function sizeFactory(constant: boolean,args: any[]) {
  return constant
    ? !args || !args.length || args[0] == 0
      ? sizeNoParams
      : sizeFactoryC(args)
    : sizeFactoryV(args);
}

function sizeNoParams(el: SVGElement, gp: RectangleLike): void {
  el.setAttribute("width", <any>(gp.width));
  el.setAttribute("height", <any>(gp.height));
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
