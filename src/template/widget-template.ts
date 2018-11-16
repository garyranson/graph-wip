import {WidgetExecFactory, WidgetTemplateAction} from "./types";
import {widgetActionReducer} from "./widget-action-reducer";
import {VertexWidget, Widget} from "template/widget";
import {State, VertexState} from "core/types";
import {WidgetActionLibrary} from "template/widget-action-library";

export interface WidgetTemplate {
  createWidget(state: State): Widget;
}

export interface WidgetTemplateService {
  create(markup: string | Element): WidgetTemplate;
}

export const WidgetTemplateServiceModule = {
  $inject: ['WidgetActionLibrary'],
  $name: 'WidgetTemplateService',
  $type: WidgetTemplateService
}

const emptyArray = Object.freeze([]);

function WidgetTemplateService(actions: WidgetActionLibrary): WidgetTemplateService {

  return {
    create
  }

  function create(svg: string | Element): WidgetTemplate {
    const root = typeof svg === 'string' ? parseSvg(svg) : parseEl(svg);
    const instructions = compileActions(root);
    const template = finalizeElement(root);
    const factory = getFactory(instructions)(instructions);

    return {
      createWidget
    };

    function createWidget(vertex: VertexState): Widget {
      return internalCreateWidget(
        template.cloneNode(true) as Element,
        instructions,
        vertex.id,
        factory
      ).refresh(vertex);
    }
  }

  function internalCreateWidget(root: Element, instructions: WidgetTemplateAction[], vertexId: any, execFactory: WidgetExecFactory): Widget {

    root.setAttribute('pxnode', vertexId);

    Array
      .from(root.querySelectorAll('[pxaction]'))
      .forEach((node: Element) => node.setAttribute('pxnode', vertexId));

    return (new VertexWidget(
      root,
      getMappedElements(root),
      execFactory,
    ));
  }

  function compileActions(root: Element): WidgetTemplateAction[] {
    return mapElements(root, (el) => {
      return _convert(
        el,
        getBindAttributes(el, (attr: Attr) => attr.name.startsWith('data-') && actions.has(attr.name))
      );
    }).map((v, i) => {
      v.el.setAttribute("GP__MAP__", <any>i);
      v.attrs.forEach((a) => v.el.removeAttribute(a.name));
      return v.attrs.map(_compile); //(a) => a.factory(a.value));
    }).map(widgetActionReducer);
  }

  function _compile(attr:Attr) : WidgetTemplateAction {
    const f = actions.get(attr.name);
    return f(attr.value);
  }

  function _convert(el: Element, attrs: any) {
    return attrs && attrs.length ? {el, attrs} : null;
  }

  function finalizeElement(root: Element): Element {
    Array
      .from(root.querySelectorAll('[data-class]'))
      .map(el => ({el, ad: el.getAttribute('data-class').split(':').map(s => s.trim())}))
      .forEach((a) => {
        if (a.ad[0]) a.el.setAttribute('pxaction', a.ad[0]);
        if (a.ad[1]) a.el.setAttribute('pxdata', a.ad[1]);
        a.el.removeAttribute('data-class');
      });
    return root.firstElementChild.cloneNode(true) as Element;
  }

}

function getMappedElements(root: Element): Element[] {
  return getMappedAttrs(root)
    .reduce((acc, attr) => {
      acc[parseInt(attr.value)] = attr.ownerElement;
      attr.ownerElement.removeAttribute(attr.name);
      return acc;
    }, []);
}

function getBindAttributes(el: Element, fn: (Attr) => boolean): Attr[] {
  const attrs = el.attributes;
  let rc: Attr[];
  for (let i = 0; i < attrs.length; i++) {
    const attr = attrs[i];
    if (fn(attr)) rc ? rc.push(attr) : rc = [attr];
  }
  return rc || emptyArray as Attr[];
}

function getMappedAttrs(root: Element): Attr[] {
  const q = Array
    .from(root.querySelectorAll('[GP__MAP__]'))
    .map((n) => n.getAttributeNode('GP__MAP__'));
  const a = root.getAttributeNode('GP__MAP__');
  if (a) q.push(a);
  return q;
}

function getFactory(instructions: WidgetTemplateAction[]): (instructions: WidgetTemplateAction[]) => (o: object, a: Element[]) => void {
  switch (instructions.length) {
    case 0:
      return r0;
    case 1:
      return r1;
    case 2:
      return r2;
    case 3:
      return r3;
    case 4:
      return r4;
    case 5:
      return r5;
    case 6:
      return r6;
    case 7:
      return r7;
    default:
      return rN;
  }
}

function noop() {
};

function r0() {
  return noop;
}

function r1(instructions: WidgetTemplateAction[]) {
  const [i0] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
  }
}

function r2(instructions: WidgetTemplateAction[]) {
  const [i0, i1] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
    i1(e[1], gp);
  }
}

function r3(instructions: WidgetTemplateAction[]) {
  const [i0, i1, i2] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
    i1(e[1], gp);
    i2(e[2], gp);
  }
}

function r4(instructions: WidgetTemplateAction[]) {
  const [i0, i1, i2, i3] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
    i1(e[1], gp);
    i2(e[2], gp);
    i3(e[3], gp);
  }
}

function r5(instructions: WidgetTemplateAction[]) {
  const [i0, i1, i2, i3, i4] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
    i1(e[1], gp);
    i2(e[2], gp);
    i3(e[3], gp);
    i4(e[4], gp);
  }
}

function r6(instructions: WidgetTemplateAction[]) {
  const [i0, i1, i2, i3, i4, i5] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
    i1(e[1], gp);
    i2(e[2], gp);
    i3(e[3], gp);
    i4(e[4], gp);
    i5(e[5], gp);
  }
}

function r7(instructions: WidgetTemplateAction[]) {
  const [i0, i1, i2, i3, i4, i5, i6] = instructions;
  return (gp: object, e: Element[]): void => {
    i0(e[0], gp);
    i1(e[1], gp);
    i2(e[2], gp);
    i3(e[3], gp);
    i4(e[4], gp);
    i5(e[5], gp);
    i6(e[6], gp);
  }
}

function rN(instructions: WidgetTemplateAction[]) {
  return (gp: object, e: Element[]): void => {
    for (let i = 0; i < instructions.length; i++) {
      instructions[i](e[i], gp);
    }
  }
}

function mapElements<T>(root: Element, fn: (el: Element) => T): T[] {
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let a: T[] = [];
  while (tw.nextNode()) {
    const rc = fn(tw.currentNode as Element);
    if (rc) a.push(rc);
  }
  return a;
}

function parseSvg(svg: string): Element {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="__root__">${svg}</svg>`, 'text/html');
  const root = doc.getElementById("__root__");
  root.normalize();
//Remove comments
  getCommentNodes(root).forEach(n => n.parentNode.removeChild(n));
  return root;
}

function parseEl(root: Element): Element {
  root.normalize();
//Remove comments
  getCommentNodes(root).forEach(n => n.parentNode.removeChild(n));
  return root;
}

function getCommentNodes(root: Element): Node[] {
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const a = [];
  while (tw.nextNode()) a.push(tw.currentNode);
  return a;
}

