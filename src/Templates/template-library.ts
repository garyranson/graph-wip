import {GpNode, GpNodeTemplate, GpNodeView} from "../types";
import GpTemplateImpl from "./node-template";

const cache = new Map<string,GpNodeTemplate>();

const defaultTemplate = new GpTemplateImpl(
  "<g class='gpobject' data-gp='mover' data-position-bind=''>" +
  "  <rect x='0' y='0' data-size-bind='0 0' style='fill:red;opacity: 1.5'></rect>" +
  "  <rect x='5' y='5' height='20' data-width-bind='-10' style='fill:red;opacity: 0.5'></rect>" +
  "  <rect x='5' y='30' data-size-bind='-10 -35' style='fill:blue;opacity: 0.5'></rect>" +
  "  <text x='5' y='5' dy='1em' dx='20px' data-text-eval='\"poo:::\"+_objectId'></text>" +
  "  <use xlink:href='#twitter' x='5' y='5' width='20' height='20'></use>"+
/*
  "  <foreignObject x='7' y='32' data-size-bind='-14 -39'>" +
  "    <div style='width:100%;height:100%;background-color: chocolate'>" +
  "      div is the middle" +
  "    </div>" +
  "  </foreignObject>"+
*/
  "</g>");


const rootTemplate = new GpTemplateImpl(
  `<svg data-gp='canvas' width='100%' height='100%' style='pointer-events: all;background-color: yellow'>` +
  `</svg>`
);

const nodeSelect = new GpTemplateImpl(
  `<g data-position-bind='0' class='gp-node-highlight'>` +
  `  <rect data-gp='outline:1' data-border-bind='0' class='gp-resize-border'></rect>` +
  `  <circle data-gp='resizer:tl' data-cxy-ratio='0 0 0 0' r='5' class='gp-resize-handle' style='cursor:nw-resize'></circle>` +
  `  <circle data-gp='resizer:bl' data-cxy-ratio='0 1 0 0' r='5' class='gp-resize-handle' style='cursor:sw-resize'></circle>` +
  `  <circle data-gp='resizer:tr' data-cxy-ratio='1 0 0 0' r='5' class='gp-resize-handle' style='cursor:ne-resize'></circle>` +
  `  <circle data-gp='resizer:br' data-cxy-ratio='1 1 0 0' r='5' class='gp-resize-handle' style='cursor:se-resize'></circle>` +
  `  <use href="#triangle-n" data-xy-ratio="0.5 0.0 -10 -15" style="fill: black"></use>`+
  `  <use href="#triangle-s" data-xy-ratio="0.5 1.0 -10 +15" style="fill: black"></use>`+
  `  <use href="#triangle-e" data-xy-ratio="0.0 0.5 -10 -15" style="fill: black"></use>`+
  `  <use href="#triangle-w" data-xy-ratio="1.0 0.5 0 -10 -15" style="fill: black"></use>`+
  `</g>`
);

const nodeHighlight = new GpTemplateImpl(
  `<g>` +
  `<rect data-position-bind='0' data-border-bind='0' class='dragOutline'></rect>` +
  `</g>`
);

const nodeResize = new GpTemplateImpl(
  `<g data-position-bind='0'>` +
  `<rect  data-border-bind='0' class='dragOutline'></rect>`+
  `<text dy="1em" text-anchor="middle" data-xy-ratio='0.5 1 0 0' data-text-template='size' font-family="Verdana" font-size="12"></text>`+
  `</g>`
);

const nodeDrag = new GpTemplateImpl(
  `<g data-position-bind='0'>` +
  `<rect  data-border-bind='0' class='dragOutline'></rect>`+
  `<text dy="1em" text-anchor="middle" data-xy-ratio='0.5 1 0 0' data-text-template='point' font-family="Verdana" font-size="12"></text>`+
  `</g>`
);

const nodeSelectorBand = new GpTemplateImpl(
  `<g data-position-bind='0'>` +
  `<rect  data-border-bind='0' class='rubberband'></rect>`+
  `<text dy="1em" text-anchor="middle" data-xy-ratio='0.5 1 0 0' data-text-template='size' font-family="Verdana" font-size="12"></text>`+
  `</g>`
);

cache.set("$node-root",rootTemplate);
cache.set("$node-highlight",nodeHighlight);
cache.set("$node-resize",nodeResize);
cache.set("$node-select",nodeSelect);
cache.set("$node-drag",nodeDrag);
cache.set("$node-selector-band",nodeSelectorBand);


cache.set("default",defaultTemplate);


export default class NodeTemplateLibrary {
  static getTemplate(name: string) {
    return cache.get(name) || defaultTemplate;
  }

  static createView(node: GpNode, nameOverride?: string) : GpNodeView {
    const template = cache.get(nameOverride||node.template) || defaultTemplate;
    return template.createView(node);
  }

}






