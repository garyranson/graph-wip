import {LineLike, PointLike, RectangleLike} from "core/types";

type Direction = 0 | 1 | 2 | 3 | 4;
type Rotate = 0 | 1 | 2 | 3 ;
type Mask = 1 | 2 | 4 | 8;
type Action = 1 | 3 | 5 | 7;

interface OrdTask {
  a: Action;
  d: Direction;
  s?: Mask;
}

const routePatterns: OrdTask[][][] = [
  [
    [{"a": 7, "d": 1}, {"a": 5, "d": 4, "s": 8}, {"a": 5, "d": 1, "s": 1}, {"a": 3, "d": 2}],
    [{"a": 7, "d": 1}, {"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 5, "d": 3, "s": 4}, {"a": 5, "d": 2, "s": 2}, {"a": 3, "d": 1}],
    [{"a": 7, "d": 1}, {"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 3, "d": 4}, {"a": 5, "d": 3, "s": 4}, {"a": 3, "d": 2}],
    [{"a": 7, "d": 1}, {"a": 5, "d": 4, "s": 8}, {"a": 3, "d": 1}, {"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 3, "d": 3}, {"a": 5, "d": 4, "s": 8}]
  ],
  [
    [{"a": 7, "d": 2}, {"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 5, "d": 4, "s": 8}, {"a": 5, "d": 1, "s": 1}, {"a": 3, "d": 2}],
    [{"a": 7, "d": 2}, {"a": 5, "d": 3, "s": 4}, {"a": 5, "d": 2, "s": 2}, {"a": 3, "d": 1}],
    [{"a": 7, "d": 2}, {"a": 5, "d": 3, "s": 4}, {"a": 3, "d": 2}, {"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 3, "d": 4}, {"a": 5, "d": 3, "s": 4}],
    [{"a": 7, "d": 2}, {"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 3, "d": 3}, {"a": 5, "d": 4, "s": 8}, {"a": 3, "d": 1}]
  ],
  [
    [{"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 5, "d": 4, "s": 8}, {"a": 5, "d": 1, "s": 1}, {"a": 3, "d": 2}],
    [{"a": 5, "d": 2, "s": 2}, {"a": 3, "d": 1}],
    [{"a": 1, "d": 2, "s": 2}, {"a": 3, "d": 2}, {"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 3, "d": 4}, {"a": 5, "d": 3, "s": 4}],
    [{"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 5, "d": 4, "s": 8}, {"a": 3, "d": 1}, {"a": 3, "d": 3}]
  ],
  [
    [{"a": 5, "d": 1, "s": 1}, {"a": 3, "d": 2}],
    [{"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 5, "d": 3, "s": 4}, {"a": 5, "d": 2, "s": 2}, {"a": 3, "d": 1}],
    [{"a": 1, "d": 1, "s": 1}, {"a": 7, "d": 1}, {"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 5, "d": 3, "s": 4}, {"a": 3, "d": 2}, {"a": 3, "d": 4}],
    [{"a": 1, "d": 1, "s": 1}, {"a": 3, "d": 1}, {"a": 1, "d": 2, "s": 2}, {"a": 7, "d": 2}, {"a": 3, "d": 3}, {"a": 5, "d": 4, "s": 8}]
  ]
];

const DIRECTION_NONE: Direction = 0;
const DIRECTION_WEST: Direction = 1;
const DIRECTION_NORTH: Direction = 2;
const DIRECTION_EAST: Direction = 3;
const DIRECTION_SOUTH: Direction = 4;

const result: PointLike[] = [null,null,null,null,null,null,null,null,null];

export function OrthConnector(
  origin: LineLike,
  source?: RectangleLike,
  target?: RectangleLike
): LineLike | { route?: PointLike[] } {

  const sourcePortX = origin.x1;
  const sourcePortY = origin.y1;
  const targetPortX = origin.x2;
  const targetPortY = origin.y2;

  const sourceT = source ? source.y : sourcePortY;
  const sourceL = source ? source.x : sourcePortX;
  const sourceB = source ? source.y + source.height : sourcePortY;
  const sourceR = source ? source.x + source.width : sourcePortX;

  const targetT = target ? target.y : targetPortY;
  const targetL = target ? target.x : targetPortX;
  const targetB = target ? target.y + target.height : targetPortY;
  const targetR = target ? target.x + target.width : targetPortX;

  const sourceJettySize = getJettySize();
  const targetJettySize = getJettySize();

  let sourceDir = !source ? DIRECTION_NONE
    : Math.abs(sourcePortY - sourceT) <= 1 ? DIRECTION_NORTH
      : Math.abs(sourcePortY - sourceB) <= 1 ? DIRECTION_SOUTH
        : Math.abs(sourcePortX - sourceL) <= 1 ? DIRECTION_WEST
          : Math.abs(sourcePortX - sourceR) <= 1 ? DIRECTION_EAST
            : DIRECTION_NONE;

  let targetDir = !target ? DIRECTION_NONE
    : Math.abs(targetPortY - targetT) <= 1 ? DIRECTION_NORTH
      : Math.abs(targetPortY - targetB) <= 1 ? DIRECTION_SOUTH
        : Math.abs(targetPortX - targetL) <= 1 ? DIRECTION_WEST
          : Math.abs(targetPortX - targetR) <= 1 ? DIRECTION_EAST
            : DIRECTION_NONE;

  let currentPoint = result[0] = {
    x: sourceDir === DIRECTION_WEST
      ? sourceL - sourceJettySize
      : sourceDir === DIRECTION_NORTH || sourceDir === DIRECTION_SOUTH
        ? source ? (sourceL + sourceR) * 0.5 : sourcePortX
        : sourceR + sourceJettySize,
    y: sourceDir === DIRECTION_WEST || sourceDir === DIRECTION_EAST
      ? source ? (sourceT + sourceB) * 0.5 : sourcePortY
      : sourceDir === DIRECTION_NORTH
        ? sourceT - sourceJettySize
        : sourceB + sourceJettySize
  };

  const rotate = getRotation(
    ((sourceL + sourceR) * 0.5) - ((targetL + targetR) * 0.5),
    ((sourceT + sourceB) * 0.5) - ((targetT + targetB) * 0.5)
  );

  let currentIndex = 0;
  let lastOrientation = sourceDir === DIRECTION_EAST || sourceDir === DIRECTION_WEST ? 0 : 1;
  let lastPoint: PointLike = null;

  const routes = getRoutePattern(sourceDir, targetDir, rotate);

  for (let i = 1, t = routes[0]; t; t = routes[i++]) {
    const direction = getDirectionIndex(t.d, rotate);
    const orientation = direction === DIRECTION_EAST || direction === DIRECTION_WEST ? 0 : 1;

    if (orientation != lastOrientation) {
      lastPoint = currentPoint;
      result[++currentIndex] = currentPoint = {
        x: currentPoint.x,
        y: currentPoint.y
      };
    }

    if (orientation === 0) {
      const dx = Math.round(
          t.a === 1 ? (getEdgePoint(t.s, rotate, sourceL, sourceT, sourceR, sourceB, sourceJettySize) - currentPoint.x)
            : t.a === 3 ? ((target ? (targetL + targetR) * 0.5 : targetPortX) - currentPoint.x)
            : t.a === 5 ? (getEdgePoint(t.s, rotate, targetL, targetT, targetR, targetB, targetJettySize) - currentPoint.x)
              : Math.max((direction === DIRECTION_WEST ? (sourceL - targetR) : (targetL - sourceR)) - (targetJettySize + sourceJettySize), 0) * 0.5);

      if ((direction === DIRECTION_WEST && dx < 0) || (direction === DIRECTION_EAST && dx > 0)) {
        currentPoint.x += dx;
        lastOrientation = 0;
      }
      else if (lastPoint && currentPoint.x === lastPoint.x && currentPoint.y === lastPoint.y) {
        currentPoint = result[--currentIndex];
        lastPoint = result[currentIndex - 1];
      } else {
        lastOrientation = 0;
      }
    } else {
      const dy = Math.round(
          t.a === 1 ? (getEdgePoint(t.s, rotate, sourceL, sourceT, sourceR, sourceB, sourceJettySize) - currentPoint.y)
            : t.a === 3 ? ((target ? (targetT + targetB) * 0.5 : targetPortY) - currentPoint.y)
            : t.a === 5 ? (getEdgePoint(t.s, rotate, targetL, targetT, targetR, targetB, targetJettySize) - currentPoint.y)
              : Math.max((direction === DIRECTION_NORTH ? (sourceT - targetB) : (targetT - sourceB)) - (targetJettySize + sourceJettySize), 0) * 0.5
        );

      if ((direction === DIRECTION_NORTH && dy < 0) || (direction === DIRECTION_SOUTH && dy > 0)) {
        currentPoint.y += dy;
        lastOrientation = 1;
      }
      else if (lastPoint && currentPoint.x === lastPoint.x && currentPoint.y === lastPoint.y) {
        currentPoint = result[--currentIndex];
        lastPoint = result[currentIndex - 1];
      } else {
        lastOrientation = 1;
      }
    }
  }

  const sz = getResultSize(currentIndex, targetDir, sourceDir);
  return sz
    ? {...origin, route: result.slice(0, sz)}
    : {...origin};
}

function getResultSize(currentIndex: number, targetDir: Direction, sourceDir: Direction): number {
  // If the last calculated point is in the same plane as the target
  // then we don't require that last point if there are an odd number of points.
  return (currentIndex % 2) === (
    (
      ((targetDir === DIRECTION_EAST || targetDir === DIRECTION_WEST)) ===
      ((sourceDir === DIRECTION_EAST || sourceDir === DIRECTION_WEST)) ? 0 : 1
    )
  ) ? currentIndex : currentIndex + 1;
}

function getDirectionIndex(direction: Direction, rotate: Rotate): Direction {
  const index = direction + rotate;
  return (index > 4 ? index - 4 : index) as Direction;
}

function getRoutePattern(sourceDir: Direction, targetDir: Direction, rotate: Rotate): OrdTask[] {
  const sourceIndex = sourceDir - rotate;
  const targetIndex = targetDir - rotate;

  return routePatterns
    [(sourceIndex < 1 ? sourceIndex + 3 : sourceIndex - 1)]
    [(targetIndex < 1 ? targetIndex + 3 : targetIndex - 1)];
}

function getEdgePoint(s: Mask, q: Rotate, l: number, t: number, r: number, b: number, j: number): number {
  switch (s << q) {
    case 1 :
    case 16 :
      return l - j; // left
    case 2:
    case 32:
      return t - j; // top
    case 4:
      return r + j; // right
    case 8:
    case 64:
      return b + j; // bottom
  }
}

function getRotation(dx: number, dy: number): Rotate {
  return dx < 0 && dy < 0 ? 2 : dx < 0 ? 1 : dy <= 0 && dx == 0 ? 2 : dy <= 0 ? 3 : 0;
}

function getJettySize() : number {
  return 20;
}
