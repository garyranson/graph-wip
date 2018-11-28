import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const XyRatioAction = {
  $type: xyRatioFactory,
  $name: 'xy-ratio',
  $item: 'expr',
}

function xyRatioFactory(constant: boolean,args: []) {
  return constant
    ? xyRatioFactoryC(args)
    : xyRatioFactoryV(args);
}

function xyRatioFactoryC(o: any[]) {
  const xratio = o[0] || 0;
  const yratio = o[1] || 0;
  const xoffset = o[2] || 0;
  const yoffset = o[3] || 0;

  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("x", <any>((gp.width * xratio) + xoffset));
    el.setAttribute("y", <any>((gp.height * yratio) + yoffset));
  };
}

function xyRatioFactoryV(o: CompiledFunction[]) {
  const xratio = o[0];
  const yratio = o[1] || xratio;
  const xoffset = o[2];
  const yoffset = o[3];

  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("x", <any>((gp.width * xratio(gp)) + (xoffset ? xoffset(gp) : 0)));
    el.setAttribute("y", <any>((gp.height * yratio(gp)) + (yoffset ? yoffset(gp) : 0)));
  }
}
