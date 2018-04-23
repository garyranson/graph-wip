import resolveAll from "./exec-reducer";
import actionReducer from "./action-reducer";
import {GpNode, GpNodeTemplate, GpNodeView, TemplateAction, TemplateActionFactory} from "../types";
import GpNodeViewImpl from "./node-view";
import parseSvg from "./parse-svg";
import DOM from "../Utils/dom";
import {findAction} from "./actions";

export default class GpTemplateImpl implements GpNodeTemplate {

  template: SVGElement;
  instructions: TemplateAction[];

  constructor(svg: string) {
    const root = parseSvg(svg);
    this.instructions = compileActions(root);
    this.template = finalizeElement(root);
  }

  createView(node: GpNode): GpNodeView {
    const root = this.template.cloneNode(true) as SVGElement;
    const nodeId= node.getId() as any;

    root.setAttribute('pxnode', nodeId);
    root.classList.add('gpobject');
    const actions = root.querySelectorAll('[pxaction]');

    for(let i=0;i<actions.length;i++) {
      actions.item(i).setAttribute('pxnode', nodeId)
    }

    const rc = resolveAll(
      getMappedElements(root),
      this.instructions
    );
    rc(node);
    return new GpNodeViewImpl(root, rc, node);
  }
}

interface IParseAttr {
  el: Element,
  attrs: {name: string, factory: TemplateActionFactory}[],
}

function getBoundAttributes(root: Element): IParseAttr[] {
  const pat = [];
  for (const el of DOM.getNodes<Element>(root, NodeFilter.SHOW_ELEMENT)) {
    const attrs = el.attributes;
    let x: IParseAttr;
    for (let i = 0; i < attrs.length; i++) {
      const factory = findAction(attrs[i].name);
      if (factory) {
        if (!x) {
          x = {el, attrs: []};
          pat.push(x);
        }
        x.attrs.push({
          name: attrs[i].name,
          factory
        });
      }
    }
  }
  return pat;
}

function compileActions(root: Element) : TemplateAction[] {

  return getBoundAttributes(root).map((v, i) => {
    v.el.setAttribute("GP__MAP__", <any>i);

    const av = actionReducer(
      v.attrs.map((a) => {
        const value = v.el.getAttribute(a.name);
        v.el.removeAttribute(a.name);
        return a.factory(value);
      })
    );

    return av;
  });
}



function finalizeElement(root: Element) : SVGElement {

  const list = root.querySelectorAll('[data-gp]');
  for (let i = 0; i < list.length; i++) {
    const node = list.item(i) as Element;
    const values = node.getAttribute('data-gp').trim().split(':').map(s=>s.trim());
    if(values[0]!=undefined) node.setAttribute('pxaction',values[0]);
    if(values[1]!=undefined) node.setAttribute('pxdata',values[1]);
    node.removeAttribute('data-gp');
  }
  return root.firstElementChild.cloneNode(true) as SVGElement;
}

function getMappedElements(root: SVGElement) : SVGElement[] {
  const a: SVGElement[] = [];
  const q = root.getAttribute('GP__MAP__');
  if(q) {
    a[parseInt(q)] = root;
    root.removeAttribute('GP__MAP__');
  }
  const list = root.querySelectorAll('[GP__MAP__]');
  for (let i = 0; i < list.length; i++) {
    const node = list.item(i) as  SVGElement;
    a[parseInt(node.getAttribute('GP__MAP__'))] = node;
    node.removeAttribute('GP__MAP__');
  }
  return a;
}


