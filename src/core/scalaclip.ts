import {PointLike, RectangleLike} from "core/types";

interface VectorLike {
  x: number;
  y: number;
  z: number;
}

interface NormalRectangle {
  t: number;
  l: number;
  b: number;
  r: number;
}

interface BoundsLike {
  t: number;
  x1: number,
  y1: number,
  x2: number,
  y2: number
//  p1: PointLike,
//  p2: PointLike
}

const mask = [0, 1, 2, 2, 4, 0, 4, 4, 8, 1, 0, 2, 8, 1, 8, 0];
const tab1 = [4, 3, 0, 3, 1, 4, 0, 3, 2, 2, 4, 2, 1, 1, 0, 4];
const tab2 = [4, 0, 1, 1, 2, 4, 2, 2, 3, 0, 4, 1, 3, 0, 3, 4];

export function clipLine(r: RectangleLike, x1: number, y1: number, x2: number, y2: number): BoundsLike {
  const b = {l: r.x, r: r.x + r.width, t: r.y, b: r.y + r.height};
  const c1 = (((x1 < b.l) ? 8 : (x1 > b.r) ? 2 : 0) + ((y1 < b.t) ? 1 : (y1 > b.b) ? 4 : 0));
  const c2 = (((x2 < b.l) ? 8 : (x2 > b.r) ? 2 : 0) + ((y2 < b.t) ? 1 : (y2 > b.b) ? 4 : 0));

  //if ((c1 | c2) == 0 || (c1 & c2) != 0) return {t: 0, p1: p1, p2: p2};
  if ((c1 | c2) == 0 || (c1 & c2) != 0) return {t: 0, x1, y1, x2, y2};

  const p = {x: y1 - y2, y: x2 - x1, z: x1 * y2 - y1 * x2};

  const c =
    (((p.x * b.l + p.y * b.t + p.z) <= 0) ? 1 : 0) +
    (((p.x * b.r + p.y * b.t + p.z) <= 0) ? 2 : 0) +
    (((p.x * b.r + p.y * b.b + p.z) <= 0) ? 4 : 0) +
    (((p.x * b.l + p.y * b.b + p.z) <= 0) ? 8 : 0);

  const t = (c == 0 || c == 15) ? -1 : (c1 != 0 && c2 != 0) ? 3 : (c1 == 0) ? 2 : 1;
  const rp1 = t == -1 || t == 2 ? {x:x1, y: y1} : getE(p, b, t == 3 || (c1 & mask[c]) == 0 ? tab1[c] : tab2[c]);
  const rp2 = t == -1 || t == 1 ? {x:x2, y: y2} : getE(p, b, t == 3 || (c2 & mask[c]) != 0 ? tab2[c] : tab1[c]);

  return {
    t,
    x1: rp1.x,
    y1: rp1.y,
    x2: rp2.x,
    y2: rp2.y
    //p1: t == -1 || t == 2 ? p1 : getE(p, b, t == 3 || (c1 & mask[c]) == 0 ? tab1[c] : tab2[c]),
    //p2: t == -1 || t == 1 ? p2 : getE(p, b, t == 3 || (c2 & mask[c]) != 0 ? tab2[c] : tab1[c])
  }
}

function getE(u: VectorLike, r: NormalRectangle, i: number): PointLike {
  return (
    i == 0 ? {x: (u.y * -r.t - u.z) / u.x, y: (-u.x * -r.t) / u.x} :
      i == 1 ? {x: (u.y * -r.r) / -u.y, y: (u.z - u.x * -r.r) / -u.y} :
        i == 2 ? {x: (u.y * -r.b - u.z) / u.x, y: (-u.x * -r.b) / u.x} :
          {x: (u.y * -r.l) / -u.y, y: (u.z - u.x * -r.l) / -u.y}
  );
}


