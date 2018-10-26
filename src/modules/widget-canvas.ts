import {WidgetTemplateLibrary} from "../template/widget-template-library";
import {EdgeState, StateIdType, VertexState} from "core/types";
import {Widget} from "template/widget";
import {animate} from "../animate/animate";
import {LineTween, TranslateTween} from "../animate/translate-tween";
import {Easings} from "../animate/easings";
import {Store} from "modules/store";

export interface WidgetCanvas {
  getWidget(id: StateIdType): Widget;

  refreshWidget(id: StateIdType): void;

  createWidget(id: StateIdType): void;

  removeWidget(id: StateIdType): void;

  appendToolWidget(widget: Widget): void;

  applyDeferred(): void;
}

export const WidgetCanvasModule = {
  $type: WidgetCanvas,
  $inject: ['WidgetTemplateLibrary', 'Container', 'Store'],
  $name: 'WidgetCanvas'
}

function WidgetCanvas(templates: WidgetTemplateLibrary, container: SVGSVGElement, store: Store): WidgetCanvas {

  const widgets = new Map<StateIdType, Widget>();

  const baseWidget = templates.createWidget(<VertexState>{
    type: "$node-root",
    x: 0,
    y: 0,
    width: 2000,
    height: 2000,
    id: '0'
  })
  container.appendChild(baseWidget.getElement());

  widgets.set('0', baseWidget);

  let deferredMap: Map<StateIdType, Widget[]>;

  return {
    refreshWidget,
    getWidget,
    createWidget,
    removeWidget,
    appendToolWidget,
    applyDeferred
  }

  function appendToolWidget(widget: Widget): void {
    baseWidget.appendChild(widget);
  }

  function getWidget(id: StateIdType): Widget {
    return widgets.get(id);
  }

  function refreshWidget(id: StateIdType): void {
    const state = store.getState(id);
    if (!state) return;
    const widget = widgets.get(state.id);
    if (!widget) return;

    if (state.class === 'vertex') {
      if ((<VertexState>state).parent !== (<VertexState>widget.state).parent) {
        console.log(`'changing parent from:${(<any>state).parent} to ${(<any>widget.state).parent}`);
        //   const newparent = widgets.get((<VertexState>state).parent);
        //  newparent.appendChild(widget);
      }

      animate(new TranslateTween(widget, 125, <VertexState>state, Easings.easeInOutQuad));
    } else {
      animate(new LineTween(widget, 125, <EdgeState>state, Easings.easeInOutQuad));
    }
  }

  function createWidget(id: StateIdType): void {
    const state = store.getState(id);
    if (!state) return;

    const widget = templates
      .createWidget(state)
      .addClass('gpobject');

    widgets.set(state.id, widget);
    widget.refresh(state);

    const parentId = (<any>state).parent || '0';
    const parent = widgets.get(parentId);

    const pw = widgets.get(parentId);

    if (pw) {
      parent.appendChild(widget);
    } else {
      addDefferred(widget, parentId);
    }
  }

  function removeWidget(id: StateIdType): void {
    const e = widgets.get(id);
    if (!e) return;
    e.remove(); //TODO: Remember to Remove children too!
    widgets.delete(id);
  }

  function addDefferred(widget: Widget, parent: StateIdType) {
    if (!deferredMap) deferredMap = new Map<StateIdType, Widget[]>();
    let a = deferredMap.get(parent);
    if (a) {
      a.push(widget);
    } else {
      deferredMap.set(parent, [widget]);
    }
  }

  function applyDeferred() {
    if (!deferredMap) return;
    deferredMap.forEach((v: Widget[], k: StateIdType) => {
      const parent = widgets.get(k);
      if (!parent) throw "Unable to resolve parent";
      v.forEach((w) => parent.appendChild(w));
    });
  }
}
