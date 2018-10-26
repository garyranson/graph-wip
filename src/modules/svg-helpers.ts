import {PointLike} from "core/types";

export interface SvgHelpers {
  pointAt(x: number, y: number): PointLike;

  pointAtElement(ele: SVGGraphicsElement, x: number, y: number): PointLike;
}

export const SvgHelpersModule = {
  $type: SvgHelpers,
  $inject: ['Container'],
  $name: 'SvgHelpers'
}

function SvgHelpers(container: SVGSVGElement): SvgHelpers {

  const pt = container.createSVGPoint();

  return {
    pointAt,
    pointAtElement
  }

  function pointAt(x: number, y: number): PointLike {
    pt.x = x;
    pt.y = y;
    const q = pt.matrixTransform(container.getScreenCTM().inverse());
    return {x: q.x, y: q.y};
  }

  function pointAtElement(ele: SVGGraphicsElement, x: number, y: number): PointLike {
    pt.x = x;
    pt.y = y;
    var q = pt.matrixTransform(ele.getScreenCTM().inverse());
    return {x: q.x, y: q.y};
  }
}
