import {CompiledFunction} from "expression-compiler";
import {RectangleLike} from "core/types";


export const TextAction = {
  $name: 'text',
  $type: 'text',
  $constant: textFactoryV
}
function textFactoryV(o: CompiledFunction) {
  return (el: SVGElement, gp: RectangleLike): void => {
    el.textContent = o(gp) || '';
  };
}

