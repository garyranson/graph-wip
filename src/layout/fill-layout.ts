import {SizeLike, VertexState} from "core/types";
import {Graph} from "modules/graph";

export function fillLayout(graph: Graph, container: VertexState, children: VertexState[]): SizeLike {
  return children
    ? children.reduce((a, c: VertexState) => {
      if (c.x + c.width > a.width) a.width = c.x + c.width;
      if (c.y + c.height > a.height) a.height = c.y + c.height;
      return a;
    }, {width: 0, height: 0})
    : null;
}
