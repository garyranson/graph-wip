import {SizeLike, VertexState} from "core/types";
import {Graph} from "modules/graph";

export function flowLayout(graph: Graph, container: VertexState, children: VertexState[]): SizeLike {
  if (!children || !children.length) return;
  let x = 10;
  let y = 10;
  let h = 0;
  let maxx = 0;
  let minx = 0
  let c = 0;

  for (const v of children) {
    if (c === 0 && v.width > minx) minx = v.width;

    if (c > 0 && x + v.width > container.width) {
      y += (h + 10);
      x = 10;
      c = 0;
      h = 0;
    }
    graph.updateVertex({...v, x, y});
    if (x + v.width > maxx) maxx = x + v.width;
    if (v.height > h) h = v.height;
    x += v.width + 10;
    c += 1;
  }

  y += 10;
  maxx += 10;

  return {width: Math.max(maxx,minx), height: y + h};
}
