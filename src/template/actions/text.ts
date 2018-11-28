import {CompiledFunction} from "expression-compiler";
import {RectangleLike} from "core/types";

export const TextAction = {
  $type: textFactory,
  $name: 'text',
  $item: 'text',
}

function textFactory(constant: boolean,value: CompiledFunction|string) {
  return constant
    ? textFactoryC(value as string)
    : textFactoryV(value as CompiledFunction);
}

function textFactoryV(o: CompiledFunction) {
  return (el: SVGElement, gp: RectangleLike): void => {
    el.textContent = o(gp) || '';
  };
}

function textFactoryC(o: any) {
  return (el: SVGElement): void => {
    el.textContent = o || '';
  };
}
