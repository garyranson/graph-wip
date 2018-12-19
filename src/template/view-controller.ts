import {WidgetTemplateLibrary} from "template/widget-template-library";
import {EdgeState, PointLike, RectangleLike, State, StateIdType, VertexState} from "core/types";
import {Widget} from "template/widget";
import {animate} from "animate/animate";
import {TranslateTween} from "animate/translate-tween";
import {Container} from "template/container-initialiser";
import {LineTween} from "animate/line-tween";

export interface ViewController {

  createRoot(state: VertexState): void;

  refreshVertexWidget(state: VertexState): void;
  refreshEdgeWidget(state: EdgeState): void;

  removeWidget(id: StateIdType): void;

  createLinkedWidget(type: string, id: StateIdType): Widget;
  removeLinkedWidget(widget: Widget, id: StateIdType): void;

  applyDeferred(): void;

  pointAt(x: number, y: number): PointLike;

  createToolWidget(type: string, state?: object): Widget;

  getCanvasBounds(id: StateIdType): RectangleLike;

  addClass(id: StateIdType, name: string): void;

  removeClass(id: StateIdType, name: string): void;

  getState<T extends State>(id: StateIdType): T;
}

export const WidgetCanvasModule = {
  $type: WidgetCanvas,
  $inject: ['WidgetTemplateLibrary', 'Container'],
  $name: 'ViewController'
}

function WidgetCanvas(templates: WidgetTemplateLibrary, container: Container): ViewController {

  const widgets = new Map<StateIdType, Widget>();
  const widgetState = new Map<StateIdType, State>();

  let rootId: StateIdType;
  let canvasElement: SVGSVGElement;
  let rootElement = container.get();
  let deferredMap = DeferredWidgets();

  let pt: SVGPoint;

  return {
    refreshVertexWidget,
    refreshEdgeWidget,
    removeWidget: remove,
    createLinkedWidget,
    removeLinkedWidget,
    applyDeferred,
    createRoot,
    getCanvasBounds,
    createToolWidget,
    pointAt,
    addClass,
    removeClass,
    getState
  }

  function addClass(id: StateIdType, clazz: string): void {
    const w = _getWidget(id);
    if (w) w.addClass(clazz);
  }

  function removeClass(id: StateIdType, clazz: string): void {
    const w = _getWidget(id);
    if (w) w.removeClass(clazz);
  }


  function _getWidgetState<T extends State>(id: StateIdType): T {
    return widgetState.get(id) as T;
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

  function getState<T extends State>(id: StateIdType): T {
    return widgetState.get(id) as T;
  }

  function createToolWidget(type: string, state?: object): Widget {
    const widget = templates.create(type);
    if (state) widget.refresh(state);
    _getWidget(rootId).appendChild(widget);
    return widget;
  }


  function createLinkedWidget(type: string, id: StateIdType): Widget {
    const w = widgets.get(id);
    const s = widgetState.get(id);
    const widget = templates.create(type,id);
    widget.refresh(s);
    w.addLinkedWidget(widget);
  //  _getWidget(rootId).appendChild(widget);
    return widget;
  }

  function removeLinkedWidget(widget: Widget, id:  StateIdType): void {
    const w = widgets.get(id);
    if (w) w.removeLinkedWidget(widget);
    widget.remove();
  }

  function _getWidget<T extends State>(id: StateIdType): Widget {
    return widgets.get(id) as Widget;
  }

  function createRoot(state: VertexState) {
    rootId = state.id;
    const widget = templates.create(state.type, rootId);
    widgetState.set(rootId, state);
    widgets.set(rootId, widget);
    rootElement.appendChild(widget.getElement());
    rootElement.setAttribute('pxnode', rootId);
    canvasElement = widget.getElement();
    pt = canvasElement.createSVGPoint();
    widget.refresh(state);
  }

  function refreshVertexWidget(to: VertexState) : void {
    const widget = widgets.get(to.id);
    if(widget)
      _refreshVertex(to,widget);
    else
      _createVertex(to);
  }

  function refreshEdgeWidget(to: EdgeState) : void {
    const widget = widgets.get(to.id);
    if(widget)
      _refreshEdge(to,widget);
    else
      _createEdge(to);
  }

  function _refreshVertex(to: VertexState, widget: Widget): void {
    const from = widgetState.get(to.id) as VertexState;
    widgetState.set(to.id, to);

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

  function _refreshEdge(state: EdgeState, widget: Widget): void {
    const from = widgetState.get(state.id) as EdgeState;
    widgetState.set(state.id, state);
    animate(new LineTween(widget, from, state), 125);
  }


  function _createVertex(state: VertexState): void {
    widgetState.set(state.id, state);
    const widget = templates.create(state.type, state.id);
    widgets.set(state.id, widget);
    let parent = state.parent;

    const pw = widgets.get(parent);

    if (pw) {
      pw.appendChild(widget);
      widget.refresh(state);
    } else {
      deferredMap.add(parent, {widget, state});
    }
  }

  function _createEdge(state: EdgeState): void {
    const widget = templates.create(state.type, state.id);
    widgets.set(state.id, widget);
    widgetState.set(state.id, state);
    widget.refresh(state);
    canvasElement.appendChild(widget.getElement());
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
    const q = pt.matrixTransform(canvasElement.getScreenCTM().inverse());
    return {x: q.x, y: q.y};
  }
}

interface DeferredWidget {
  widget: Widget,
  state: State
}

function DeferredWidgets() {
  let deferredMap: Map<StateIdType, DeferredWidget[]>;
  if (!deferredMap) deferredMap = new Map<StateIdType, DeferredWidget[]>();
  return {
    add(parent: StateIdType, widget: DeferredWidget) {
      if (!deferredMap) deferredMap = new Map<StateIdType, DeferredWidget[]>();
      let a = deferredMap.get(parent);
      if (a) {
        a.push(widget);
      } else {
        deferredMap.set(parent, [widget]);
      }
    },
    apply(widgets: Map<StateIdType, Widget>) {
      if (!deferredMap) return;
      deferredMap.forEach((v: DeferredWidget[], k: StateIdType) => {
        const parent = widgets.get(k);
        if (!parent) throw `Unable to resolve parent (${k})`;
        v.forEach((w) => {
          parent.appendChild(w.widget);
          w.widget.refresh(w.state);
        });
      });
      deferredMap = null;
    },
    get(): Map<StateIdType, DeferredWidget[]> {
      return deferredMap;
    }
  }
}
