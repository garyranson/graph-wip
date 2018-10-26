import {WidgetExecFactory, WidgetTemplateAction} from "./types";
import {widgetActionReducer} from "./widget-action-reducer";
import {VertexWidget, Widget} from "template/widget";
import {State, VertexState} from "core/types";
import {WidgetActionLibrary} from "template/widget-action-library";

export interface WidgetTemplate {
  createWidget(state: State): Widget;
}

export interface WidgetTemplateService {
  create(markup: string): WidgetTemplate;
}

export const WidgetTemplateServiceModule = {
  $inject: ['WidgetActionLibrary'],
  $name: 'WidgetTemplateService',
  $type: WidgetTemplateService
}

function WidgetTemplateService(actions: WidgetActionLibrary): WidgetTemplateService {

  return {
    create
  }

  function create(svg: string): WidgetTemplate {
    const root = parseSvg(svg);
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
    return mapElementNodes(root, (el) => {
      const attrs = mapElementAttrs(el, (attr) => attr.name.startsWith('data-') && actions.has(attr.name) ? {
        name: attr.name,
        factory: actions.get(attr.name),
        value: attr.value
      } : null);
      return attrs && attrs.length ? {el, attrs} : null;
    }).map((v, i) => {
      v.el.setAttribute("GP__MAP__", <any>i);
      v.attrs.forEach((a) => v.el.removeAttribute(a.name));
      return widgetActionReducer(v.attrs.map((a) => a.factory(a.value)));
    });
  }

  function finalizeElement(root: Element): Element {
    Array
      .from(root.querySelectorAll('[data-gp]'))
      .map(n => n.getAttributeNode('data-gp'))
      .forEach((a) => {
        const n = a.ownerElement;
        const [action, data] = a.value.split(':').map(s => s.trim())
        if (action) n.setAttribute('pxaction', action);
        if (data) n.setAttribute('pxdata', data);
        n.removeAttribute(a.name);
      });
    return root.firstElementChild.cloneNode(true) as Element;
  }

  function getMappedElements(root: Element): Element[] {
    const q = getMappedAttrs(root)
      .reduce((acc, attr) => {
        const n = attr.ownerElement;
        acc[parseInt(attr.value)] = n;
        n.removeAttribute(attr.name);
        return acc;
      }, []);
    return q;
  }
}

function getMappedAttrs(root: Element) : Attr[] {
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

function mapElementNodes<T>(root: Element, fn: (el: Element) => T): T[] {
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  let a: T[] = [];
  while (tw.nextNode()) {
    const rc = fn(tw.currentNode as Element);
    if (rc) a.push(rc);
  }
  return a;
}

function mapElementAttrs<T>(el: Element, fn: (attr: Attr) => T): T[] {
  const attrs = el.attributes;
  let a: T[];
  for (let i = 0; i < attrs.length; i++) {
    const r = fn(attrs[i]);
    if (!r) continue;
    if (!a) a = [];
    a.push(r);
  }
  return a;
}

function parseSvg(svg: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="__root__">${svg}</svg>`, 'text/html');
  const root = doc.getElementById("__root__");
  root.normalize();
//Remove comments
  getCommentNodes(root)
    .forEach(n => n.parentNode.removeChild(n));
  return root;
}

function getCommentNodes(root: Element): Node[] {
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT);
  const a = [];
  while (tw.nextNode()) a.push(tw.currentNode);
  return a;
}

