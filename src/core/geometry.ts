// @return {double} length of the line


import {PointLike, RectangleLike} from "core/types";

export function lineLength(start: PointLike, end: PointLike) : number {
  return Math.sqrt(squaredLength(start, end));
}

export function lineMidPoint(p1: PointLike, p2: PointLike) : PointLike {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

export function rectMidPoint(r: RectangleLike) : PointLike {
  return {
    x: r.x + (r.width/2),
    y: r.y + (r.height/2)
  };
}

// @return {integer} length without sqrt
// @note for applications where the exact length is not necessary (e.g. compare only)
function squaredLength(start: PointLike, end: PointLike)  : number {
  return (start.x - end.x) ** 2 + (start.y - end.y) ** 2;
}

export function movePoint(me: PointLike, ref: PointLike, distance:number) {
  var _theta = toRadians(computeAngle(me,ref));
  return offset(me, Math.cos(_theta) * distance, -Math.sin(_theta) * distance);
}

// Offset me by the specified amount.
function offset(me: PointLike, dx?:number, dy?: number) : PointLike {
  return {x: Math.round(me.x + (dx || 0)), y: Math.round(me.y + (dy || 0))};
}

export function toRadians(deg:number, over360?:boolean) {
  return (over360 ? deg : (deg % 360)) * Math.PI / 180;
}
// Compute the angle between me and `p` and the x axis.
// (cartesian-to-polar coordinates conversion)
// Return theta angle in degrees.
export function computeAngle2(p1: PointLike,p2: PointLike) : number {
  const rad = Math.atan2(-(p2.y - p1.y), p2.x - p1.x); // defined for all 0 corner cases
  return 180 * ((rad < 0) ? 2 * Math.PI + rad : rad) / Math.PI;
}


export function computeAngle(p1: PointLike,p2: PointLike) : number {
  // NOTE: Remember that most math has the Y axis as positive above the X.
  // However, for screens we have Y as positive below. For this reason,
  // the Y values are inverted to get the expected results.
  const result = Math.atan2((p1.y - p2.y), (p2.x - p1.x)) * 180/Math.PI;
  return (result < 0) ? (360 + result) : result;
}
