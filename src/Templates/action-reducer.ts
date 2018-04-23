import {GpNode, TemplateAction} from "../types";

function r0(el: SVGElement, gp: GpNode) : void {
}

function r2(x1: TemplateAction, x2: TemplateAction) : TemplateAction {
  return function(el: SVGElement, gp: GpNode) {
    x1(el,gp);
    x2(el,gp);
  };
}
function r3(x1: TemplateAction, x2: TemplateAction, x3: TemplateAction) : TemplateAction {
  return function(el: SVGElement, gp: GpNode) {
    x1(el,gp);
    x2(el,gp);
    x3(el,gp);
  };
}
function r4(x1: TemplateAction, x2: TemplateAction, x3: TemplateAction, x4: TemplateAction) : TemplateAction {
  return function(el: SVGElement, gp: GpNode) {
    x1(el,gp);
    x2(el,gp);
    x3(el,gp);
    x4(el,gp);
  };
}
function r5(x1: TemplateAction, x2: TemplateAction, x3: TemplateAction, x4: TemplateAction, x5: TemplateAction) : TemplateAction {
  return function(el: SVGElement, gp: GpNode) {
    x1(el,gp);
    x2(el,gp);
    x3(el,gp);
    x4(el,gp);
    x5(el,gp);
  };
}
function rN(values:TemplateAction[]) : TemplateAction {
  return function (el: SVGElement, gp: GpNode) {
    for (const x of values) {
      x(el, gp);
    }
  };
}

export default function actionReducer(values: TemplateAction[]) {
  switch (values.length) {
    case 0:
      return r0;
    case 1:
      return values[0];
    case 2:
      return r2(values[0], values[1]);
    case 3:
      return r3(values[0], values[1], values[2]);
    case 4:
      return r4(values[0], values[1], values[2], values[3]);
    case 5:
      return r5(values[0], values[1], values[2], values[3], values[4]);
    default:
      return rN(values);
  }
}
