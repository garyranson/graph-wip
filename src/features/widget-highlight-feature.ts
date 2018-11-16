import {AppBus} from "bus/app-bus";
import {WidgetTemplateLibrary} from "../template/widget-template-library";
import {NodeEnterLeaveEvent} from "bus/node-hightlight-bus";
import {WidgetCanvas} from "modules/widget-canvas";
import {Widget} from "template/widget";
import {Store} from "modules/store";
import {StateIdType, VertexState} from "core/types";
import {ModelController} from "modules/model-controller";

export const WidgetHighlightFeatureModule = {
  $type: WidgetHighlightFeature,
  $inject: ['AppBus', 'WidgetCanvas', 'Store', 'WidgetTemplateLibrary','ModelController'],
  $name: 'WidgetHighlightFeature'
}
function WidgetHighlightFeature(appBus: AppBus, canvas: WidgetCanvas, store: Store, nodeTemplateLibary: WidgetTemplateLibrary, model: ModelController) {

  interface NodeCacheEntry {
    timer: number;
    id: StateIdType;
    widget: Widget;
  }

  const nodeCache = new Map<string, NodeCacheEntry>();

  let currentNode: string;

  const nodeEnter = appBus.nodeEnterLeave.add((e: NodeEnterLeaveEvent) => {
    //leave
    if (currentNode && (!e || currentNode !== e.enter)) {
      const view = getShadow(currentNode, true);
      if (view) view.addClass('px-off');
      currentNode = null;
    }
    //enter
    const s = store.getState(e.enter);
    console.log(e.enter,s);
    if (s && s.$type.isSelectable) {
      currentNode = e.enter;
      const widget = getShadow(currentNode, false) || createShadow(currentNode);
      if (widget) widget.removeClass('px-off');
    }
  });

  function createShadow(e: StateIdType): Widget {
    const widget = nodeTemplateLibary.create(adjustForCanvas(e));
    canvas.appendToolWidget(widget);
    nodeCache.set(e, {timer: 0, widget,id: e});
    return widget;
  }


  function adjustForCanvas(id: StateIdType) : VertexState {
    const ev = model.getVertexCanvasBounds(id);
    return {...ev, id, type: '$shape-highlight'} as VertexState;
  }

  function getShadow(id: StateIdType, reset?: boolean): Widget {
    const entry = nodeCache.get(id);
    if (!entry) return;
    if (entry.timer) clearTimeout(entry.timer);
    entry.timer = reset ? setTimeout(() => remove(id), 1000) : 0;
    const widget = entry.widget;
    widget.refresh(adjustForCanvas(id));
    return widget;
  }

  function remove(e: string) {
    const view = getShadow(e);
    if (!view) return;
    nodeCache.delete(e);
    view.remove();
  }

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.nodeEnterLeave.remove(nodeEnter);
    nodeCache.forEach((v, k) => remove(k));
  });
}
