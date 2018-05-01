import {createSvgElement} from "./svg";

const pt = createSvgElement('svg').createSVGPoint();

export default function svgPoint(element, x:number, y:number) : {x:number,y:number} {
  pt.x = x;
  pt.y = y;
  const p = pt.matrixTransform(element.getScreenCTM().inverse());
  return {
    x: p.x,
    y: p.y
  };
}

export function pointFromEvent(element, e: {clientX: number, clientY: number}) : {x:number,y:number} {
  pt.x = e.clientX;
  pt.y = e.clientY;
  const p = pt.matrixTransform(element.getScreenCTM().inverse());
  return {
    x: Math.round(p.x),
    y: Math.round(p.y)
  };
}
