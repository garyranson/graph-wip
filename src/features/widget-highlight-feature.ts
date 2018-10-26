import {AppBus} from "bus/app-bus";
import {WidgetTemplateLibrary} from "../template/widget-template-library";
import {NodeEnterLeaveEvent} from "bus/node-hightlight-bus";
import {WidgetCanvas} from "modules/widget-canvas";
import {Widget} from "template/widget";
import {Store} from "modules/store";
import {StateIdType} from "core/types";

export const WidgetHighlightFeatureModule = {
  $type: WidgetHighlightFeature,
  $inject: ['AppBus', 'WidgetCanvas', 'Store', 'WidgetTemplateLibrary'],
  $name: 'WidgetHighlightFeature'
}
function WidgetHighlightFeature(appBus: AppBus, canvas: WidgetCanvas, store: Store, nodeTemplateLibary: WidgetTemplateLibrary) {

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
      if (view) view.removeClass('gp-on').addClass('gp-off');
      currentNode = null;
    }
    //enter
    if (e && e.enter && e.enter !== '0') {
      currentNode = e.enter;
      const widget = getShadow(currentNode, false) || createShadow(currentNode);
      if (widget) widget.removeClass('gp-off').addClass('gp-on');
    }
  });

  function createShadow(e: string): Widget {
    const vertex = store.getVertex(e);
    if (!vertex) return;
    const widget = nodeTemplateLibary.createWidget({...vertex, ...{type: '$node-highlight'}});
    canvas.appendToolWidget(widget);
    nodeCache.set(e, {timer: 0, widget,id: e});
    return widget;
  }

  function getShadow(nodeId: string, reset?: boolean): Widget {
    const entry = nodeCache.get(nodeId);
    if (!entry) return;
    if (entry.timer) clearTimeout(entry.timer);
    entry.timer = reset ? setTimeout(() => remove(nodeId), 2000) : 0;
    const widget = entry.widget;
    widget.refresh(store.getVertex(entry.id));
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
