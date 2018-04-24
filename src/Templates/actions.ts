import {GpNode, TemplateAction, TemplateActionFactory} from "../types";
import {Compiler} from "expression-compiler";


function widthFactory(o: any) {
  const offset = o.key||0;
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("width", <any>(gp.width + offset));
  };
}

function borderFactory(o: any) {
  const offset = o.key||0;
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("x", <any>(- offset));
    el.setAttribute("y", <any>(- offset));
    el.setAttribute("width", <any>(gp.width + offset + offset));
    el.setAttribute("height", <any>(gp.height + offset + offset));
  };
}

function sizeFactory(o: any) {
  const wOffset = o.values[0]||0;
  const hOffset = o.values[1]||wOffset;

  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("width", <any>(gp.width + wOffset));
    el.setAttribute("height", <any>(gp.height + hOffset));
  };
}


function heightFactory(o:any) {
  const offset = o.key;
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("height", <any>(gp.height + offset));
  };
}
function positionFactory(o:any) {
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("transform", `translate(${gp.x},${gp.y})`);
  };
}
function textFactory(o:any) {
  return (el: SVGElement, gp: GpNode): void => {
    el.textContent=gp.getId().toString();
  };
}
function boundsFactory(o:any) {
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("height", <any>(gp.height));
    el.setAttribute("width", <any>(gp.width));
    el.setAttribute("x", <any>(gp.x));
    el.setAttribute("y", <any>(gp.y));
  };
}

function bindCache<T>(factory: (o) => TemplateAction, build:(s:string) => {key: T}) {
  let cache : Map<T,TemplateAction>;

  return function(value: string) : TemplateAction {
    const o =  build(value);

    if(!cache) {
      cache = new Map<T,TemplateAction>();
    }
    let rc = cache.get(o.key);
    if(!rc) {
      rc = factory(o);
      cache.set(o.key,rc);
    }
    return rc;
  }
}

function bindSingleton<T>(factory: (o) => TemplateAction) {
  let cache: TemplateAction;
  return function (value: string): TemplateAction {
    return cache||(cache=factory(null));
  }
}

function simpleParse(s: string) : any {
  return {key: parseInt(s)||0};
}

function twoParse(s: string) : any {
  const x = s.split(/\s+/).map((s) => parseFloat(s));
  return {
    key: s,
    v1: x[0],
    v2: x[1]
  };
}

function splitParse(s: string) : any {
  const x = s.split(/\s+/).map((s) => parseFloat(s));
  return {
    key: x.join(','),
    values: x,
  };
}


function xRatioFactory(o: any) {
  const ratio = o.v1;
  const offset = o.v2||0;
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("x", <any>((gp.width * ratio) + offset));
  };
}

function yRatioFactory(o: any) {
  const ratio = o.v1;
  const offset = o.v2||0;
  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("y", <any>((gp.height * ratio) + offset));
  };
}

function xyRatioFactory(o: any) {
  const xratio = o.values[0]||0;
  const yratio = o.values[1]||0;
  const xoffset = o.values[2]||0;
  const yoffset = o.values[3]||0;
  console.log('creating:',o.values);

  return (el: SVGElement, gp: GpNode): void => {
    el.setAttribute("x", <any>((gp.width  * xratio) + xoffset));
    el.setAttribute("y", <any>((gp.height * yratio) + yoffset));
  };
}



const bindMap = {
  'data-text-bind': bindSingleton(textFactory),
  'data-text-eval': bindCache(textExprFactory, expressionParse),
  'data-position-bind': bindSingleton(positionFactory),
  'data-bounds-bind': bindSingleton(boundsFactory),
  'data-height-bind': bindCache(heightFactory, simpleParse),
  'data-border-bind': bindCache(borderFactory, simpleParse),
  'data-width-bind': bindCache(widthFactory, simpleParse),
  'data-size-bind': bindCache(sizeFactory,splitParse),
  'data-x-ratio': bindCache(xRatioFactory,twoParse),
  'data-y-ratio': bindCache(yRatioFactory,twoParse),
  'data-xy-ratio': bindCache(xyRatioFactory,splitParse),
};


export function findAction(name: string) : TemplateActionFactory {
  return bindMap[name];
}


function expressionParse(expr: string) {
  const compiler = new Compiler();
  const r = compiler.compile(expr);
  return {
    key: expr,
    expr: r.toFunction()
  };
}

function textExprFactory(o:any) {
  const expr = o.expr;
  return (el: SVGElement, gp: GpNode): void => {
    el.textContent=expr(gp);
  };
}
