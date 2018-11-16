import {WidgetTemplateLibrary} from "../template/widget-template-library";
import {WidgetCanvas} from "modules/widget-canvas";
import {LineLike, RectangleLike, State, StateIdType, VertexState} from "core/types";

export interface ShadowWidget {
  remove();

  update(object);

  getBounds(): RectangleLike;

  getState(): State;

  addClass(c: string): this;

  removeClass(c: string): this;
}

export interface ShadowWidgetFactory {
  create(vertex: RectangleLike | LineLike, type: string, tool?: string, id?: string): ShadowWidget;
}

export const ShadowWidgetFactoryModule = {
  $type: ShadowWidgetFactory,
  $inject: ['WidgetCanvas', 'WidgetTemplateLibrary'],
  $name: 'ShadowWidgetFactory'
}

function ShadowWidgetFactory(canvas: WidgetCanvas, templateLibrary: WidgetTemplateLibrary): ShadowWidgetFactory {

  return {
    create: function createShadowWidget(vertex: State & (RectangleLike | LineLike), type: string, tool?: string,id?: StateIdType): ShadowWidget {
      let shadow = (id)?{...vertex, id, type}:{...vertex, type};
      let widget = templateLibrary.create(shadow);

      if (tool) canvas.appendToolWidget(widget);

      return {
        remove: () => {
          widget.remove();
        },
        update: (obj: object) => {
          widget.refresh({...shadow, ...obj});
        },
        getBounds(): RectangleLike {
          const r = widget.state as VertexState;
          return {x: r.x, y: r.y, width: r.width, height: r.height}
        },
        getState(): State {
          return widget.state;
        },
        addClass(this: ShadowWidget, c: string): ShadowWidget {
          widget.addClass(c);
          return this;
        },
        removeClass(this: ShadowWidget, c: string): ShadowWidget {
          widget.removeClass(c);
          return this;
        }
      }
    }
  };
}
