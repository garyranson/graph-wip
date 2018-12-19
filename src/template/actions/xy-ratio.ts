import {RectangleLike} from "core/types";

export const XyRatioAction = {
  $type: xyRatioFactory,
  $name: 'xy-ratio',
  $item: 'split',
}

const dir = {
  tl: [0.0, 0.0],
  tm: [0.5, 0.0],
  tr: [1.0, 0.0],
  ml: [0.0, 0.5],
  mm: [0.5, 0.5],
  mr: [1.0, 0.5],
  bl: [0.0, 1.0],
  bm: [0.5, 1.0],
  br: [1.0, 1.0]
}

function xyRatioFactory(words: string) {
  return words.length > 1
    ? WithOffset(
      dir[words[0]] || dir.tl,
      parseFloat(words[1]) || 0,
      parseFloat(words[2]) || 0
    )
    : NoOffset(
      dir[words[0]] || dir.tl
    );
}

function NoOffset(ratio: number[]) {
  const xratio = ratio[0];
  const yratio = ratio[1];
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("transform", `translate(${(gp.width * xratio)},${(gp.height * yratio)})`);
  };
}

function WithOffset(ratio: number[], offsetX: number, offsetY: number) {
  const xratio = ratio[0];
  const yratio = ratio[1];
  return (el: SVGElement, gp: RectangleLike): void => {
    el.setAttribute("transform", `translate(${offsetX + (gp.width * xratio)},${offsetY + (gp.height * yratio)})`);
  };
}
