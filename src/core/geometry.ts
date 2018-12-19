// @return {double} length of the line


import {LineLike, PointLike, RectangleLike} from "core/types";

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

export function lineFromPoints(p1: PointLike, p2: PointLike) : LineLike {
  return {
    x1: p1.x,
    y1: p1.y,
    x2: p2.x,
    y2: p2.y
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







interface RectangleOrientation {
  t: boolean;
  l: boolean;
  tl: boolean;
  tr: boolean;
  bl: boolean;
  br: boolean;
  b: boolean;
  r: boolean;
  mask: number;
  offsets: number[];
}

const orientation: RectangleOrientation[] = [
  [0,0,0,0],
  [1, 0.5, 0, 0.5],//1 0001 ...R R M L M
  [0.5, 1, 0.5, 0],//2 0010 ..B. M B M T
  [1, 0.5, 0.5, 0],//3 0011 ..BR R M M T
  [0, 0.5, 1, 0.5],//4 0100 .L.. L M R M
  ,
  [0, 0.5, 0.5, 0],//6 0110 .LB. L M M T
  ,
  [0.5, 0, 0.5, 1],//8 1000 T... M T M B
  [1, 0.5, 0.5, 1],//9 1001 T..R R M M B
  ,//a
  ,//b
  [0, 0.5, 0.5, 1],//c 1100 TL.. L M M B
].map((offsets, mask) => {
  return offsets
    ? Object.freeze({
      t: (mask & 0b1000) > 0,
      l: (mask & 0b0100) > 0,
      b: (mask & 0b0010) > 0,
      r: (mask & 0b0001) > 0,
      tl: (mask & 0b1100) === 0b1100,
      tr: (mask & 0b1001) === 0b1001,
      bl: (mask & 0b0110) === 0b0110,
      br: (mask & 0b0011) === 0b0011,
      mask,
      offsets
    }) : undefined;
});

export function getOrientation(source: RectangleLike, target: RectangleLike): RectangleOrientation {
  return orientation[(
    /*T*/ (((target.y + target.height) <= (source.y)) ? 8 : 0) |
    /*L*/ (((target.x + target.width) <= (source.x)) ? 4 : 0) |
    /*B*/ (((target.y) >= (source.y + source.height)) ? 2 : 0) |
    /*R*/ (((target.x) >= (source.x + source.width)) ? 1 : 0)
  )];
}

export function calcOrientatedLine(s: RectangleLike, t: RectangleLike): LineLike {
  // TODO: Adjust for Jetty size rather than hard-code the 20.
  const o = getOrientation(s, t);

  return {
    x1: s.x + (o.offsets[0] * s.width),
    y1: s.y + (o.offsets[1] * s.height),
    x2: t.x + (o.offsets[2] * t.width),
    y2: t.y + (o.offsets[3] * t.height),
  };
}


/*
export function getOrientation(source: RectangleLike, target: RectangleLike) {
  return (
    (((target.y + target.height) <= (source.y)) ? 8 : 0) | //T
    (((target.x + target.width) <= (source.x)) ? 4 : 0) |  //L
    (((target.y) >= (source.y + source.height)) ? 2 : 0) | //B
    (((target.x) >= (source.x + source.width)) ? 1 : 0)   //R
  );
}
*/
