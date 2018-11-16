import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";
export const BorderAction = {
  $type: borderFactory,
  $name: 'border',
  $ftype: 'expr',
}

function borderFactory(constant: boolean,args: any[]) {
  return constant
    ? !args || !args.length || args[0] == 0
      ? borderFactoryF
      : borderFactoryC(args)
    : borderFactoryV(args);
}

function borderFactoryF(el: Element,gp: RectangleLike) {
  el.setAttribute("x", <any>0);
  el.setAttribute("y", <any>0);
  el.setAttribute("width", <any>gp.width);
  el.setAttribute("height", <any>gp.height);
}


function borderFactoryC(o: any[]) {
  const offset = o[0] || 0;
  return (el: SVGElement, gp: RectangleLike): void => {
    setit(el, offset, gp.width , gp.height );
  };
}

function borderFactoryV(o: CompiledFunction[]) {
  const [_offset] = o;
  return (el: SVGElement, gp: RectangleLike): void => {
    setit(el, _offset(gp) || 0, gp.width, gp.height);
  };
}

function setit(el: Element,o:any,w:any,h:any) {
  el.setAttribute("x", <any>(-o));
  el.setAttribute("y", <any>(-o));
  el.setAttribute("width", w+o+o);
  el.setAttribute("height", h+o+o);
}
