import {BoundsLike, LineLike, PointLike, RectangleLike} from "core/types";

interface DeltaLike {
  x: number;
  y: number;
  z: number;
}

const mask = [0, 1, 2, 2, 4, 0, 4, 4, 8, 1, 0, 2, 8, 1, 8, 0];
const tab1 = [e4, e3, e0, e3, e1, e4, e0, e3, e2, e2, e4, e2, e1, e1, e0, e4];
const tab2 = [e4, e0, e1, e1, e2, e4, e2, e2, e3, e0, e4, e1, e3, e0, e3, e4];

export function clipLine(r: RectangleLike, l: LineLike): LineLike&{t:number} {
  const b = {l: r.x, r: r.x + r.width, t: r.y, b: r.y + r.height};
  const c1 = (((l.x1 < b.l) ? 8 : (l.x1 > b.r) ? 2 : 0) + ((l.y1 < b.t) ? 1 : (l.y1 > b.b) ? 4 : 0));
  const c2 = (((l.x2 < b.l) ? 8 : (l.x2 > b.r) ? 2 : 0) + ((l.y2 < b.t) ? 1 : (l.y2 > b.b) ? 4 : 0));

  if ((c1 | c2) == 0 || (c1 & c2) != 0) return {t: -1, x1: l.x1, y1: l.y1, x2: l.x2, y2: l.y2};

  const p = {x: l.x2 - l.x1, y: l.y1 - l.y2, z: l.x1 * l.y2 - l.y1 * l.x2};

  const c =
    (((p.y * b.l + p.x * b.t + p.z) <= 0) ? 1 : 0) +
    (((p.y * b.r + p.x * b.t + p.z) <= 0) ? 2 : 0) +
    (((p.y * b.r + p.x * b.b + p.z) <= 0) ? 4 : 0) +
    (((p.y * b.l + p.x * b.b + p.z) <= 0) ? 8 : 0);

  const t = c === 0 || c === 15 ? 0 : (c1 && c2) ? 3 : c2 ? 2 : 1;

  const p1 = t === 0 || t === 1 ? {x: l.x1, y: l.y1} : (t === 3 || (c1 & mask[c]) == 0 ? tab2[c] : tab1[c])(p, b);
  const p2 = t === 0 || t === 2 ? {x: l.x2, y: l.y2} : (t === 3 || (c2 & mask[c]) != 0 ? tab2[c] : tab1[c])(p, b);

  return {t, x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y};
}

function e0(u: DeltaLike, r: BoundsLike): PointLike {
  return {x: (u.x * -r.t - u.z) / u.y, y: (u.y * r.t) / u.y};
}

function e1(u: DeltaLike, r: BoundsLike): PointLike {
  return {x: (u.x * -r.r) / -u.x, y: (u.z - u.y * -r.r) / -u.x};
}

function e2(u: DeltaLike, r: BoundsLike): PointLike {
  return {x: (u.x * -r.b - u.z) / u.y, y: (u.y * r.b) / u.y};
}

function e3(u: DeltaLike, r: BoundsLike): PointLike {
  return {x: (u.x * -r.l) / -u.x, y: (u.z - u.y * -r.l) / -u.x};
}

function e4(u: DeltaLike, r: BoundsLike): PointLike {
  return {x: (u.x * -r.l) / -u.x, y: (u.z - u.y * -r.l) / -u.x};
}

