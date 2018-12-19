import {RectangleLike} from "core/types";

export const TranslateAction = {
  $type: translateFactory,
  $name: 'translate',
  $item: 'self',
  $constant: translateFactory
}

function translateFactory() {
  return translateAction;
}

function translateAction(el: SVGGraphicsElement, gp: RectangleLike): void {
  if(!gp)
    console.log('here');
  el.setAttribute("transform", `translate(${gp.x},${gp.y})`);
}
