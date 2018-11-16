import {WidgetTemplateLibrary} from "../template/widget-template-library";
import {PointLike, StateIdType, VertexState} from "core/types";
import {Widget} from "template/widget";
import {animate} from "../animate/animate";
import {LineTween, TranslateTween} from "../animate/translate-tween";
import {Easings} from "../animate/easings";
import {Store} from "modules/store";
import {Container} from "modules/container-initialiser";

export interface WidgetCanvas {
//  getWidgetState<T extends State>(id: StateIdType): T;

  refreshWidget(id: StateIdType): void;

  removeWidget(id: StateIdType): void;

  appendToolWidget(widget: Widget): void;

  applyDeferred(): void;

  pointAt(x: number, y: number): PointLike;
//  pointAtElement(ele: SVGGraphicsElement, x: number, y: number): PointLike;
}

export const WidgetCanvasModule = {
  $type: WidgetCanvas,
  $inject: ['WidgetTemplateLibrary', 'Container', 'Store'],
  $name: 'WidgetCanvas'
}

function WidgetCanvas(templates: WidgetTemplateLibrary, containerO: Container, store: Store): WidgetCanvas {

  let rootId: StateIdType;
  let rootElement: SVGSVGElement;
  let container = containerO.get();
  const widgets = new Map<StateIdType, Widget>();
  let deferredMap = DeferredWidgets();
  let pt : SVGPoint;

  return {
    refreshWidget,
    removeWidget,
    appendToolWidget,
    applyDeferred,
    pointAt
  }

  function appendToolWidget(widget: Widget): void {
    _getWidget(rootId).appendChild(widget);
  }

  function _getWidget(id: StateIdType): Widget {
    return widgets.get(id);
  }

  function refreshWidget(id: StateIdType): void {
    const widget = widgets.get(id);

    if (!widget) {
      createWidget(id);
    } else if (widget.state.class === 'vertex') {
      refreshVertexWidget(widget, id);
    } else {
      refreshEdgeWidget(widget, id);
    }
  }

  function refreshVertexWidget(widget: Widget, id: StateIdType): void {
    const state = store.getState(id) as VertexState;
    const ostate = widget.state as VertexState;

    if (state.parent !== ostate.parent) {
      const newparent = widgets.get(state.parent);
      widget.mergeState({parent: state.parent});
      //TODO: Recalc x,y of moved widget so that it's the same coord system as new parent
      newparent.appendChild(widget);
    }

    animate(new TranslateTween(widget, id===store.getRootId()?0:125, state, Easings.easeInOutQuad));
  }

  function refreshEdgeWidget(widget: Widget, id: StateIdType): void {
    animate(new LineTween(widget, 125, store.getState(id), Easings.easeInOutQuad));
  }


  function createWidget(id: StateIdType): void {
    const state = store.getState(id) as VertexState;
    if (!state) return;

    const widget = templates
      .create(state);

    widgets.set(id, widget);

    let parent = state.parent;

    if (parent) {
      const pw = widgets.get(parent);
      if (pw) {
        pw.appendChild(widget);
        widget.refresh(state);
      }
      else deferredMap.add(parent, widget);

    } else if (!rootId) {
      container.appendChild(widget.getElement());
      container.setAttribute('pxnode', id);
      rootId = id;
      rootElement = widget.getElement();
      pt = rootElement.createSVGPoint();
      widget.refresh(state);
    } else {
      throw "already has root element";
    }
  }

  function removeWidget(id: StateIdType): void {
    const e = widgets.get(id);
    if (!e) return;
    e.remove(); //TODO: Remember to Remove children too!
    widgets.delete(id);
  }

  function applyDeferred() {
    deferredMap.apply(widgets);
  }

  function pointAt(x: number, y: number): PointLike {
    pt.x = x;
    pt.y = y;
    const q = pt.matrixTransform(rootElement.getScreenCTM().inverse());
    return {x: q.x, y: q.y};
  }

/*
  function pointAtElement(ele: SVGGraphicsElement, x: number, y: number): PointLike {
    pt.x = x;
    pt.y = y;
    var q = pt.matrixTransform(ele.getScreenCTM().inverse());
    return {x: q.x, y: q.y};
  }
*/
}


function DeferredWidgets() {
  let deferredMap: Map<StateIdType, Widget[]>;
  if (!deferredMap) deferredMap = new Map<StateIdType, Widget[]>();
  return {
    add(parent: StateIdType, widget: Widget) {
      if (!deferredMap) deferredMap = new Map<StateIdType, Widget[]>();
      let a = deferredMap.get(parent);
      if (a) {
        a.push(widget);
      } else {
        deferredMap.set(parent, [widget]);
      }
    },
    apply(widgets: Map<StateIdType, Widget>) {
      if (!deferredMap) return;
      deferredMap.forEach((v: Widget[], k: StateIdType) => {
        const parent = widgets.get(k);
        if (!parent)   throw `Unable to resolve parent (${k})`;
        v.forEach((w) => {
          parent.appendChild(w);
          w.refresh(w.state);
        });
      });
      deferredMap = null;
    }
  }
}
