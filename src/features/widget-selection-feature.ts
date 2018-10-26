import {WidgetTemplateLibrary} from "template/widget-template-library";
import {AppBus} from "bus/app-bus";
import {WidgetCanvas} from "modules/widget-canvas";
import {Widget} from "template/widget";
import {StateIdType, VertexState} from "core/types";
import {Store} from "modules/store";
import {WidgetActionClickEvent} from "drag-handlers/types";

export const WidgetSelectionFeatureModule = {
  $type: WidgetSelectionFeature,
  $inject: ['AppBus','WidgetTemplateLibrary', 'WidgetCanvas','Store'],
  $name: 'WidgetSelectionFeature'
}
function WidgetSelectionFeature(appBus: AppBus, nodeTemplateLibrary: WidgetTemplateLibrary, canvas: WidgetCanvas, store: Store) {
  const selected = new Map<StateIdType, SelectedNode>();

  let nodeClick = appBus.nodeClick.add((e: WidgetActionClickEvent) => {
    if (!e) {
      clear();
      return;
    }
    if (e.button !== 0) return; //left mouse button only
    const vertex = store.getVertex(e.id);

    switch (e.shiftKeys) {
      case 0:
        clear();
        on(vertex);
        return;
      case 4:
        toggle(vertex);
        return;
    }
  });

  let destroy = appBus.diagramDestroy.add((e) => {
    appBus.nodeClick.remove(nodeClick);
    appBus.diagramDestroy.remove(destroy);
  });

  function clear(): void {
    selected.forEach((h) => h.complete());
    selected.clear();
  }

  function on(vertex: VertexState) {
    if (!vertex) return;
    const vertexId = vertex.id;

    let obj = selected.get(vertexId);

    if (obj) {
      obj.on();
      return;
    }
    const widget = nodeTemplateLibrary.createWidget({...vertex, ...{type: '$node-select'}});
    canvas.appendToolWidget(widget);

    selected.set(
      vertexId,
      new SelectedNode(
        selected,
        vertexId,
        widget
      )
    );
  }

  function off(vertex: VertexState) {
    if (!vertex) return;
    const nodeId = vertex.id;
    let obj = selected.get(nodeId);
    if (!obj) return;
    obj.off();
  }

  function toggle(vertex: VertexState) {
    if (!vertex) return;
    const nodeId = vertex.id;
    const obj = selected.get(nodeId);
    if (obj) {
      off(vertex);
    } else {
      on(vertex);
    }
  }
}

class SelectedNode {
  private timer: number = 0;

  constructor(
    private highlights: Map<StateIdType, SelectedNode>,
    private id: StateIdType,
    private widget: Widget
  ) {
    this.on();
  }

  on() {
    if (this.timer) clearTimeout(this.timer);
    this.widget.removeClass('gp-off').addClass('gp-on');
  }

  off() {
    if (this.timer) clearTimeout(this.timer);
    this.widget.removeClass('gp-on').addClass('gp-off');
    this.timer = setTimeout(() => this.complete(), 250);
  }

  complete() {
    if(this.timer) clearTimeout(this.timer);
    this.highlights.delete(this.id);
    this.widget.remove();
    this.timer = 0;
  }
}

