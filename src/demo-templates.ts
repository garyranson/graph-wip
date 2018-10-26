import {WidgetTemplateLibrary} from "template/widget-template-library";
import {WidgetTemplateService} from "template/widget-template";
export const DemoTemplatesModule = {
  $inject: ['WidgetTemplateLibrary','WidgetTemplateService'],
  $name: 'demoTemplates',
  $type: demoTemplates
}
function demoTemplates(library: WidgetTemplateLibrary,widgetService: WidgetTemplateService) {
  const temp = {
    'default':
      "<g class='gpobject' data-gp='mover' data-position-bind=''>" +
      "  <rect x='0' y='0' data-size-bind='0,0' style='fill:red;opacity: 0.5'></rect>" +
      "  <rect x='5' y='5' height='20' data-width-bind='-10' style='fill:red;opacity: 0.5'></rect>" +
      "  <rect x='5' y='30' data-size-bind='-10,-35' style='fill:blue;opacity: 0.5'></rect>" +
      "  <text x='5' y='5' dy='1em' dx='20px' data-text='poo:::${id}'></text>" +
      "  <use xlink:href='#twitter' x='5' y='5' width='20' height='20'></use>" +
      "  <foreignObject x='7' y='32' data-size-bind='-14,-39'>" +
      "    <div style='width:100%;height:100%;background-color: chocolate'>" +
      "      div is the middle" +
      "    </div>" +
      "  </foreignObject>" +
      "</g>",
    "$node-root":
      `<svg data-gp='canvas' width='100%' height='100%' style='pointer-events: all;background-color: yellow'>` +
      `<g data-gp-config data-anti-position></g>`+
      `</svg>`,
    "$container":
      "<g class='gpobject' data-gp='mover' data-position-bind=''>" +
      "  <rect x='0' y='0' data-size-bind='0,0' style='fill:blue;opacity: 0.5'></rect>" +
      "  <g data-gp-config data-anti-position></g>" +
      "</g>",
    "$node-select":
      `<g data-position-bind='0' class='gp-node-highlight'>` +
      `  <rect data-gp='outline:1' data-border-bind='0' class='gp-resize-border'></rect>` +
      `  <circle data-gp='resizer:tl' data-cxy-ratio='0,0,0,0' r='5' class='gp-resize-handle' style='cursor:nw-resize'></circle>` +
      `  <circle data-gp='resizer:bl' data-cxy-ratio='0,1,0,0' r='5' class='gp-resize-handle' style='cursor:sw-resize'></circle>` +
      `  <circle data-gp='resizer:tr' data-cxy-ratio='1,0,0,0' r='5' class='gp-resize-handle' style='cursor:ne-resize'></circle>` +
      `  <circle data-gp='resizer:br' data-cxy-ratio='1,1,0,0' r='5' class='gp-resize-handle' style='cursor:se-resize'></circle>` +
      `  <use href="#triangle-n" data-xy-ratio="0.5, 0.0, -10,-15" style="fill: black" data-gp="connector:n"></use>` +
      `  <use href="#triangle-s" data-xy-ratio="0.5, 1.0, -10, +5" style="fill: black" data-gp="connector:s"></use>` +
      `  <use href="#triangle-e" data-xy-ratio="1.0, 0.5,   5,-15" style="fill: black" data-gp="connector:e"></use>` +
      `  <use href="#triangle-w" data-xy-ratio="0.0, 0.5, -15,-15" style="fill: black" data-gp="connector:w"></use>` +
      `</g>`,
    "$node-highlight":
      `<g class="gp-node-highlight">` +
      `<rect data-position-bind='0' data-border-bind='0' class='dragOutline'></rect>` +
      `</g>`,
    "$node-diagramResize": `<g data-position-bind='0'>` +
      `<rect  data-border-bind='0' class='dragOutline'></rect>` +
      `<text dy="1em" text-anchor="middle" data-xy-ratio='0.5 ,1 ,0 ,0' data-text-template='size' font-family="Verdana" font-size="12"></text>` +
      `</g>`,
    "$node-mouseDragDrag":
      `<g data-position-bind='0'>` +
      `<rect  data-border-bind='0' class='dragOutline'></rect>` +
      `<text dy="1em" text-anchor="start" data-xy-ratio='0, 0, 3, 3' data-text-template='point' font-family="Verdana" font-size="12"></text>` +
      `</g>`,
    "$node-selector-band": `<g data-position-bind='0'>` +
      `<rect  data-border-bind='0' class='rubberband'></rect>` +
      `<text dy="1em" text-anchor="middle" data-xy-ratio='0.5, 1 ,0 ,0' data-text-template='size' font-family="Verdana" font-size="12"></text>` +
      `</g>`,
    "$rect":
      `<rect  data-bounds-bind='' class='rubberband'></rect>`,
    "$connector1":
      `<line style='pointer-events: none' data-connector stroke="green" stroke-width="3" marker-end="url(#arrow)" />`,
    "$connector2":
      `<g style="pointer-events: none">` +
      `<line style='pointer-events: none' data-connector stroke="green" stroke-width="3" marker-end="url(#arrow)" />` +
      `<text dy="1em" text-anchor="middle" data-connector-xy data-text-template='angle' font-family="Verdana" font-size="12"></text>` +
      `</g>`,
    "$connector":
      `<g style="pointer-events: none">` +
      `<path data-connector-path stroke="green" fill="none" marker-mid="url(#dot)" stroke-width="3" marker-end="url(#arrow)" />` +
      "<text dy='1em' text-anchor='middle' data-connector-xy='50, 50, 50, 50' data-text font-family='Verdana' font-size='12'>[${x2},${y2}]</text>" +
      `</g>`
  }

  Object.entries(temp)
    .map(([key,value]) => ({key, value:widgetService.create(value)}))
    .forEach((o)  => library.register(o.key,o.value));
}
