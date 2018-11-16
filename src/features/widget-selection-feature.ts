import {AppBus} from "bus/app-bus";
import {RectangleLike, StateIdType} from "core/types";
import {WidgetActionClickEvent} from "drag-handlers/types";
import {ModelController} from "modules/model-controller";
import {ShadowWidget, ShadowWidgetFactory} from "modules/shadow-widget-factory";
import {Store} from "modules/store";

export const WidgetSelectionFeatureModule = {
  $type: WidgetSelectionFeature,
  $inject: ['AppBus', 'ModelController', 'ShadowWidgetFactory','Store'],
  $name: 'WidgetSelectionFeature'
}

function WidgetSelectionFeature(
  appBus: AppBus,
  model: ModelController,
  shadowFactory: ShadowWidgetFactory,
  store: Store
) {
  const selected = new Map<StateIdType, SelectedNode>();

  let nodeClick = appBus.nodeClick.add((e: WidgetActionClickEvent) => {


    if (!e) {
      clear();
      return;
    }

    const s = store.getState(e.id);

    if(!s.$type.isSelectable) return;

    if (e.button === 0 && e.shiftKeys === 0) {
      clear();
      on(e.id);
    }
    else if (e.button === 0 && e.shiftKeys === 4) {
      toggle(e.id);
    }
  });

  let destroy = appBus.diagramDestroy.add((e) => {
    appBus.nodeClick.remove(nodeClick);
    appBus.diagramDestroy.remove(destroy);
  });

  function clear(): void {
    selected.forEach((h) => h.off());
  }

  function on(id: StateIdType) {
    const obj = selected.get(id) || _create(id);
    if (obj) obj.on(model.getVertexCanvasBounds(id));
  }

  function toggle(id: StateIdType) {
    const obj = selected.get(id);
    if (obj) {
      obj.off();
    } else {
      on(id);
    }
  }

  function _create(id: StateIdType): SelectedNode {
    return _set(
      id,
      new SelectedNode(_cancel, id, shadowFactory.create(model.getVertexCanvasBounds(id), '$node-select', 'tool', id))
    );
  }

  function _cancel(id: StateIdType): void {
    const s = selected.get(id);
    if (!s) return;
    selected.delete(id);
    s.complete();
  }

  function _set(id:StateIdType,w: SelectedNode) : SelectedNode {
    selected.set(id,w);
    return w;
  }
}

class SelectedNode {
  private timer: number = 0;

  constructor(private cb: any, private id: StateIdType, private widget: ShadowWidget) {
  }

  on(state: RectangleLike) {
    if (this.timer) clearTimeout(this.timer);
    this.widget.removeClass('px-off').update(state);
  }

  off() {
    if (this.timer) clearTimeout(this.timer);
    this.widget.addClass('px-off');
    this.timer = setTimeout(this.cb, 2000, this.id);
  }

  complete() {
    if (this.timer) clearTimeout(this.timer);
    if (!this.cb) return;
    this.widget.remove();
    this.timer = 0;
    this.cb = null;
  }
}
