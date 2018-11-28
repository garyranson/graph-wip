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
  const w = vertex.width <= bb.width ? '100%' : <any>vertex.width;
  const h = vertex.height <= bb.height ? '100%' : <any>vertex.height;
  console.log('resize',w,h,vertex.width,bb.width);
  if(!Number.isFinite(vertex.width))
    console.log('but');
  el.setAttribute('width', vertex.width <= bb.width ? '100%' : <any>vertex.width);
  el.setAttribute('height', vertex.height <= bb.height ? '100%' : <any>vertex.height);
}
