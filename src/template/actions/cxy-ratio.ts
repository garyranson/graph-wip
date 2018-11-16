import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const CxyRatioAction = {
  $type: CxyRatioFactory,
  $name: 'cxy-ratio',
  $ftype: 'expr'
}

function CxyRatioFactory(constant: boolean,args: []) {
  return constant ? cxyRatioFactoryC(args) : cxyRatioFactoryV(args);
}

function cxyRatioFactoryC(o: any) {
  const xratio = o[0] || 0;
  const yratio = o[1] || 0;

  return (el: SVGElement, gp: RectangleLike): void => {
    setit(el, gp.width * xratio, gp.height * yratio);
  }
}

function cxyRatioFactoryV(o: CompiledFunction[]) {
  const xratio = o[0];
  const yratio = o[1] || xratio;

  return (el: SVGElement, gp: RectangleLike): void => {
    setit(el, gp.width * xratio(gp), gp.height * yratio(gp));
  }
}

function setit(el:Element,x:any,y:any) {
  el.setAttribute("cx", x);
  el.setAttribute("cy", y);
}
