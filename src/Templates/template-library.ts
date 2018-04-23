import {GpNode, GpNodeTemplate, GpNodeView} from "../types";
import GpTemplateImpl from "./node-template";

const cache = new Map<string,GpNodeTemplate>();

const defaultTemplate = new GpTemplateImpl(
  "<g class='gpobject' data-gp='core' data-position-bind=''>" +
  "  <rect x='0' y='0' data-size-bind='0 0' style='fill:red;opacity: 1.5'></rect>" +
  "  <rect x='5' y='5' height='20' data-width-bind='-10' style='fill:red;opacity: 0.5'></rect>" +
  "  <rect x='5' y='30' data-size-bind='-10 -35' style='fill:blue;opacity: 0.5'></rect>" +
  "  <text x='5' y='5' dy='1em' dx='20px' data-text-eval='\"poo:::\"+x'></text>" +
  "  <use xlink:href='#twitter' x='5' y='5' width='20' height='20'></use>"+
  "  <foreignObject x='7' y='32' data-size-bind='-14 -39'>" +
  "    <div style='width:100%;height:100%;background-color: chocolate'>" +
  "      div is the middle" +
  "    </div>" +
  "  </foreignObject>"+
  "</g>");

const rootTemplate = new GpTemplateImpl(
  "<svg data-size-bind='0'>" +
  "</svg>"
);

const outline = new GpTemplateImpl(
  "<g data-position-bind='0'>" +
  "  <rect data-gp='outline:1' data-border-bind='5' class='resizerBorder'></rect>" +
  "  <rect data-gp='resize:tl'  data-xy-ratio='0 0 -10 -10' width='10' height='10' class='resizerHandle'></rect>" +
  "  <rect data-gp='resize:bl'  data-xy-ratio='0 1 -10   0' width='10' height='10' class='resizerHandle'></rect>" +
  "  <rect data-gp='resize:tr'  data-xy-ratio='1 0   0 -10' width='10' height='10' class='resizerHandle'></rect>" +
  "  <rect data-gp='resize:br'  data-xy-ratio='1 1   0   0' width='10' height='10' class='resizerHandle'></rect>" +
  "</g>"
);


cache.set("default",defaultTemplate);
cache.set("rootNode",rootTemplate);
cache.set("outline",outline);

export default class NodeTemplateLibrary {
  static getTemplate(name: string) {
    return cache.get(name) || defaultTemplate;
  }

  static createView(node: GpNode, nameOverride?: string) : GpNodeView {
    const template = cache.get(nameOverride||node.template) || defaultTemplate;
    return template.createView(node);
  }
}






