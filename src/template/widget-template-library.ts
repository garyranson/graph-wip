import {WidgetTemplate} from "./widget-template";
import {Widget} from "template/widget";
import {StateIdType} from "core/types";

export interface WidgetTemplateLibrary {
  get(name: string): WidgetTemplate;

  create(type: string,id?: StateIdType): Widget;

  register(name: string, template: WidgetTemplate);
}

export const WidgetTemplateLibraryModule = {
  $inject: [],
  $name: 'WidgetTemplateLibrary',
  $type: WidgetTemplateLibrary
}

function WidgetTemplateLibrary(): WidgetTemplateLibrary {
  const cache = new Map<string, WidgetTemplate>();

  return {
    get,

    create(type: string,id?: StateIdType): Widget {
      try {
        return get(type).createWidget(type, id);
      } catch (e) {
        console.log(`can't create Widget ${type}`);
        throw e;
      }
    },

    register(name: string, template: WidgetTemplate): void {
      cache.set(name, template);
    }
  }

  function get(name: string) : WidgetTemplate {
    return cache.get(name) || cache.get('default');
  }
}
