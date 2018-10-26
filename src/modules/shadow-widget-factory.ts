import {WidgetTemplateLibrary} from "../template/widget-template-library";
import {WidgetCanvas} from "modules/widget-canvas";
import {RectangleLike, State, VertexState} from "core/types";

export interface ShadowWidget {
  remove();

  update(object);

  getBounds(): RectangleLike;

  getState(): State;
}

export interface ShadowWidgetFactory {
  create(vertex: VertexState, type: string, tool?: string): ShadowWidget;
}

export const ShadowWidgetFactoryModule = {
  $type: ShadowWidgetFactory,
  $inject: ['WidgetCanvas', 'WidgetTemplateLibrary'],
  $name: 'ShadowWidgetFactory'
}

function ShadowWidgetFactory(canvas: WidgetCanvas, templateLibrary: WidgetTemplateLibrary): ShadowWidgetFactory {

  return {
    create: function createShadowWidget(vertex: VertexState, type: string, tool?: string): ShadowWidget {
      let shadow = {...vertex, ...{type}};
      let widget = templateLibrary.createWidget(shadow);

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
        }
      }
    }
  };
}
