import {RectangleLike} from "core/types";

export const TranslateAction = {
  $type: translateFactory,
  $name: 'translate',
  $ftype: 'self',
  $constant: translateFactory
}

function translateFactory() {
  return translateAction;
}

function translateAction(el: SVGGraphicsElement, gp: RectangleLike): void {
  el.setAttribute("transform", `translate(${gp.x},${gp.y})`);
}
