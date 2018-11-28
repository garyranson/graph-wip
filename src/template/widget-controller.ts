import {WidgetTemplateLibrary} from "template/widget-template-library";
import {EdgeState, PointLike, RectangleLike, State, StateIdType, VertexState} from "core/types";
import {Widget} from "template/widget";
import {animate} from "animate/animate";
import {TranslateTween} from "animate/translate-tween";
import {Container} from "template/container-initialiser";
import {AppBus} from "bus/app-bus";
import {WidgetDragActionEvent, WidgetSelectionEvent} from "bus/widget-bus";
import {LineTween} from "animate/line-tween";

export interface WidgetController {

  createRoot(state: VertexState): void;

  refreshWidget(state: State): void;

  removeWidget(id: StateIdType): void;

  appendToolWidget<T extends State>(widget: Widget<T>): void;

  addLinkedWidget(widget: Widget<VertexState>, id: StateIdType): void;

  removeLinkedWidget(widget: Widget<VertexState>, id: StateIdType): void;

  applyDeferred(): void;

  pointAt(x: number, y: number): PointLike;

  getCanvasBounds(id: StateIdType): RectangleLike;
}

export const WidgetCanvasModule = {
  $type: WidgetCanvas,
  $inject: ['AppBus', 'WidgetTemplateLibrary', 'Container'],
  $name: 'WidgetController'
}

function WidgetCanvas(appBus: AppBus, templates: WidgetTemplateLibrary, containerO: Container): WidgetController {

  let rootId: StateIdType;
  let rootElement: SVGSVGElement;
  let container = containerO.get();
  const widgets = new Map<StateIdType, Widget<State>>();
  let deferredMap = DeferredWidgets();

  let pt: SVGPoint;

  appBus.widgetDragAction.add((e: WidgetDragActionEvent) => {
    const widget = _getWidget<VertexState>(e.id);
    if (!widget) return;
    switch (e.type) {
      case 'drag-start' :
        widget.addClass('px-drag');
        return;
      case 'drag-end' :
        widget.removeClass('px-drag');
        return;
    }
  });


  appBus.widgetSelection.add((e: WidgetSelectionEvent) => {
    _setClass(
      e.id,
      e.selectionState == 'on',
      e.type == 'drag'
        ? 'px-hover-drag'
        : e.type == 'hover'
        ? 'px-hover'
        : null
    );
  });

  function _setClass(id: StateIdType,on:boolean,klass: string) {
    if(!klass) return;
    const widget = _getWidget<VertexState>(id);
    if (!widget) return;
    if (on) widget.addClass(klass);
    else widget.removeClass(klass);
  }



  return {
    refreshWidget,
    removeWidget: remove,
    appendToolWidget,
    addLinkedWidget,
    removeLinkedWidget,
    applyDeferred,
    createRoot,
    getCanvasBounds,
    pointAt
  }

  function _getWidgetState<T extends State>(id: StateIdType): T {
    const w = widgets.get(id) as Widget<T>;
    return w && w.state;
  }

  function getCanvasBounds(id: StateIdType): RectangleLike {
    let s = _getWidgetState<VertexState>(id);
    if (!s) return {x: 0, y: 0, width: 0, height: 0};
    let x = 0;
    let y = 0;
    let w = s.width;
    let h = s.height;

    while (s.parent) {
      x += s.x;
      y += s.y;
      s = _getWidgetState(s.parent);
    }
    return {x, y, width: w, height: h};
  }

  function appendToolWidget<T extends State>(widget: Widget<T>): void {
    _getWidget(rootId).appendChild(widget);
  }

  function addLinkedWidget(widget: Widget<VertexState>, id: StateIdType): void {
    const r = widgets.get(id);
    if(r) r.addLinkedWidget(widget);
  }

  function removeLinkedWidget(widget: Widget<VertexState>, id: StateIdType): void {
    const r = widgets.get(id);
    if(r) r.removeLinkedWidget(widget);
  }

  function _getWidget<T extends State>(id: StateIdType): Widget<T> {
    return widgets.get(id) as Widget<T>;
  }

  function createRoot(state: VertexState) {
    const widget = templates.create(state);
    widgets.set(state.id, widget);
    container.appendChild(widget.getElement());
    container.setAttribute('pxnode', state.id);
    rootId = state.id;
    rootElement = widget.getElement();
    pt = rootElement.createSVGPoint();
    widget.refresh(state);
  }

  function refreshWidget(to: State): void {
    const widget = widgets.get(to.id);

    if (to.class === 'vertex') {
      if (!widget)
        createVertex(to as VertexState);
      else
        refreshVertex(to as VertexState, widget as Widget<VertexState>);
    } else {
      if (!widget) {
        createEdge(to as EdgeState);
      } else {
        refreshEdge(to as EdgeState, widget as Widget<EdgeState>);
      }
    }
  }

  function refreshVertex(to: VertexState, widget: Widget<VertexState>): void {
    const from = widget.getState();
    if (to.parent === from.parent) {
      animate(new TranslateTween(widget, from, to), to.id === rootId ? 0 : 125);
      return;
    }

    const parent = widgets.get(to.parent);
    const sbb = widget.getBoundingBox();
    const tbb = parent.getBoundingBox();

    animate(
      new TranslateTween(
        widget,
        {
          ...from,
          x: sbb.left - tbb.left,
          y: sbb.top - tbb.top,
          parent: to.parent
        },
        to,
        parent
      ),
      to.id === rootId ? 0 : 125
    );
  }

  function refreshEdge(state: EdgeState, widget: Widget<EdgeState>): void {
    animate(new LineTween(widget, state), 125);
  }

  function createVertex(state: VertexState): void {
    const widget = templates.create(state);
    widgets.set(state.id, widget);

    let parent = state.parent;

    const pw = widgets.get(parent);

    if (pw) {
      pw.appendChild(widget);
      widget.refresh(state);
    }
    else {
      deferredMap.add(parent, widget);
    }
  }

  function createEdge(state: EdgeState): void {
    const widget = templates.create(state);
    widgets.set(state.id, widget);
    widget.refresh(state);
    const pw = widgets.get(state.from) as Widget<VertexState>;
    const hs = widgets.get(pw.getState().parent);
    if (hs) hs.appendChild(widget);
  }

  function remove(id: StateIdType): void {
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
}

function DeferredWidgets() {
  let deferredMap: Map<StateIdType, Widget<State>[]>;
  if (!deferredMap) deferredMap = new Map<StateIdType, Widget<State>[]>();
  return {
    add(parent: StateIdType, widget: Widget<State>) {
      if (!deferredMap) deferredMap = new Map<StateIdType, Widget<State>[]>();
      let a = deferredMap.get(parent);
      if (a) {
        a.push(widget);
      } else {
        deferredMap.set(parent, [widget]);
      }
    },
    apply(widgets: Map<StateIdType, Widget<State>>) {
      if (!deferredMap) return;
      deferredMap.forEach((v: Widget<State>[], k: StateIdType) => {
        const parent = widgets.get(k);
        if (!parent) throw `Unable to resolve parent (${k})`;
        v.forEach((w) => {
          parent.appendChild(w);
          w.refresh(w.state);
        });
      });
      deferredMap = null;
    }
  }
}
