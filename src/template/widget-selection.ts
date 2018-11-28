import {AppBus} from "bus/app-bus";
import {RectangleLike, StateIdType} from "core/types";
import {ShadowWidget, ShadowWidgetFactory} from "template/shadow-widget-factory";
import {WidgetSelectionEvent} from "bus/widget-bus";

export const WidgetSelectionModule = {
  $type: WidgetSelection,
  $inject: ['AppBus', 'ShadowWidgetFactory'],
  $name: 'WidgetSelection'
}

function WidgetSelection(
  appBus: AppBus,
  shadowFactory: ShadowWidgetFactory,
) {

  const map = new Map<StateIdType, SelectedWidget>();

  let selection = appBus.widgetSelection.add((e: WidgetSelectionEvent) => {
    const id = e.id;
    const template = e.template || '$node-select';
    const layer = 'tool';
    const key = `${template}::${id}`;

    let m = map.get(key);

    if (e.selectionState === 'off') {
      if (!m) return;
      m.off();
    } else if (e.selectionState === 'on') {
      if (m) {
        m.on(e.bounds);
      } else {
        map.set(key, new SelectedWidget(
          _cancel,
          shadowFactory.createVertex(e.bounds, template, layer, id),
          key
        ));
      }
    }
  });

  let destroy = appBus.diagramDestroy.add((e) => {
    appBus.widgetSelection.remove(selection);
    appBus.diagramDestroy.remove(destroy);
  });

  function _cancel(id: StateIdType): void {
    const s = map.get(id);
    if (!s) return;
    map.delete(id);
    s.complete();
  }

  class SelectedWidget {
    private timer: number = 0;

    constructor(private cb: any, private widget: ShadowWidget, private key: string) {
    }

    on(state: RectangleLike) {
      if (this.timer) clearTimeout(this.timer);
      this.widget.removeClass('px-off').update(state);
    }

    off() {
      if (this.timer) clearTimeout(this.timer);
      this.widget.addClass('px-off');
      this.timer = setTimeout(this.cb, 2000, this.key);
    }

    complete() {
      if (this.timer) clearTimeout(this.timer);
      if (!this.cb) return;
      this.widget.remove();
      this.timer = 0;
      this.cb = null;
    }
  }
}
