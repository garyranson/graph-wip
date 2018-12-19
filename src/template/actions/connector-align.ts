import {EdgeState} from "core/types";

export const AlignAction = {
  $type: alignFactory,
  $name: 'align',
  $item: 'self',
}

function alignFactory(value: string) {
  return value==='from'?positionFactory1:value==='to'?positionFactory2:positionFactoryM;
}

function positionFactory1(el: SVGElement, gp: EdgeState) {
  const x2 = gp.route && gp.route[0]?gp.route[0].x:gp.x2;
  const y2 = gp.route && gp.route[0]?gp.route[0].y:gp.y2;
    el.setAttribute('transform',`translate(${gp.x1},${gp.y1}),rotate(${360 - (Math.atan2((gp.y1 - y2), (x2 - gp.x1)) * 180/Math.PI)})`);
}

function positionFactory2(el: SVGElement, gp: EdgeState) {
  const x1 = gp.route && gp.route[gp.route.length-1]?gp.route[gp.route.length-1].x:gp.x1;
  const y1 = gp.route && gp.route[gp.route.length-1]?gp.route[gp.route.length-1].y:gp.y1;
  el.setAttribute('transform',`translate(${gp.x2},${gp.y2}),rotate(${360 - (Math.atan2((y1 - gp.y2), (gp.x2 - x1)) * 180/Math.PI)})`);
}

function positionFactoryM(el: SVGElement, gp: EdgeState) {
  el.setAttribute('transform',`translate(${(gp.x2+gp.x1)/2},${(gp.y2+gp.y1)/2}),rotate(${360 - (Math.atan2((gp.y1 - gp.y2), (gp.x2 - gp.x1)) * 180/Math.PI)})`);
}
