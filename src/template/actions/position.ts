import {RectangleLike} from "core/types";
import {CompiledFunction} from "expression-compiler";

export const PositionAction = {
  $type: positionFactory,
  $name: 'position',
  $ftype: 'expr',
}

function positionFactory(constant: boolean,args: []) {
  return constant ? args.length?positionFactoryC(args) : positionNoParams : positionFactoryV(args);
}

function positionNoParams(el: SVGElement, gp: RectangleLike): void {
  el.setAttribute("x", <any>(gp.x));
  el.setAttribute("y", <any>(gp.y));
}

function positionFactoryC(o: any[]) {
  const wOffset = o[0] || 0;
  const hOffset = o[1] || wOffset;

  return (el: SVGElement, gp: RectangleLike): void => {
    console.log(`pos:C:${gp.x}:${gp.y}:${wOffset}:${hOffset}`)
    el.setAttribute("x", <any>(gp.x + wOffset));
    el.setAttribute("y", <any>(gp.y + hOffset));
  };
}

function positionFactoryV(o: CompiledFunction[]) {
  const wOffset = o[0];
  const hOffset = o[1] || wOffset;

  return (el: SVGElement, gp: RectangleLike): void => {
    console.log(`pos:V:${gp.x}:${gp.y}:${wOffset(gp)}:${hOffset(gp)}`)
    el.setAttribute("x", <any>(gp.x + (wOffset(gp) || 0)));
    el.setAttribute("y", <any>(gp.y + (hOffset(gp) || 0)));
  };
}
