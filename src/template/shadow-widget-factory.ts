import {WidgetTemplateLibrary} from "./widget-template-library";
import {WidgetController} from "template/widget-controller";
import {EdgeState, LineLike, RectangleLike, State, StateIdType, VertexState} from "core/types";

export interface ShadowWidget {
  remove();

  update(object);

  getBounds(): RectangleLike;

  getState(): State;

  addClass(c: string): this;

  removeClass(c: string): this;
}

export interface ShadowWidgetFactory {
  createVertex(vertex: RectangleLike, type: string, tool?: string, id?: string): ShadowWidget;
  createEdge(vertex: LineLike, type: string, tool?: string, id?: string): ShadowWidget;
}

export const ShadowWidgetFactoryModule = {
  $type: ShadowWidgetFactory,
  $inject: ['WidgetController', 'WidgetTemplateLibrary'],
  $name: 'ShadowWidgetFactory'
}

function ShadowWidgetFactory(canvas: WidgetController, templateLibrary: WidgetTemplateLibrary): ShadowWidgetFactory {

  return {
    createVertex,
    createEdge
  }

  function createVertex(vertex: RectangleLike, type: string, tool?: string, id?: StateIdType): ShadowWidget {
    let shadow = ((id) ? {...<object>vertex, id, type} : {...<object>vertex, type}) as VertexState;
    let widget = templateLibrary.create(shadow);

    if (tool) {
      canvas.appendToolWidget(widget);
      if(id) canvas.addLinkedWidget(widget,id);
    }

    return {
      remove: () => {
        widget.remove();
        if(id) canvas.removeLinkedWidget(widget, id);
      },
      update: (obj: object) => {
        if (obj) widget.refresh({...shadow, ...obj});
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

  function createEdge(vertex: LineLike, type: string, tool?: string, id?: StateIdType): ShadowWidget {
    let shadow = ((id) ? {...<object>vertex, id, type} : {...<object>vertex, type}) as EdgeState;
    let widget = templateLibrary.create(shadow);

    if (tool) canvas.appendToolWidget(widget);

    return {
      remove: () => {
        widget.remove();
      },
      update: (obj: object) => {
        if (obj) widget.refresh({...shadow, ...obj});
      },
      getBounds(): RectangleLike {
        return null;
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
}

