import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const CxyRatioAction = {
  $name: 'cxy-ratio',
  $type: 'simple',
  $expr: cxyRatioFactoryV,
  $constant: cxyRatioFactoryC
}


function cxyRatioFactoryC(o: any) {
  const xratio = o[0] || 0;
  const yratio = o[1] || 0;

  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("cx", <any>(gp.width * xratio));
    el.setAttribute("cy", <any>(gp.height * yratio));
  };
}

function cxyRatioFactoryV(o: CompiledFunction[]) {
  const xratio = o[0];
  const yratio = o[1] || xratio;

  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("cx", <any>(gp.width * xratio(gp)));
    el.setAttribute("cy", <any>(gp.height * yratio(gp)));
  };
}
