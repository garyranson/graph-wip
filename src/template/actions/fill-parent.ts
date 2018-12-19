import {RectangleLike} from "core/types";

export const ParentSizeAction = {
  $type: fillParentFactory,
  $name: 'fill-parent',
  $item: 'self',
}


function fillParentFactory() {
  return fillParent;
}

function fillParent(el: SVGGraphicsElement, vertex: RectangleLike): void {
  if (!el.parentElement) return;
  const bb = el.parentElement.getBoundingClientRect();
  el.setAttribute('width', vertex.width <= bb.width ? '100%' : <any>vertex.width);
  el.setAttribute('height', vertex.height <= bb.height ? '100%' : <any>vertex.height);
}
