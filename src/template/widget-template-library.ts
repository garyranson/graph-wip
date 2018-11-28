import {WidgetTemplate} from "./widget-template";
import {Widget} from "template/widget";
import {State} from "core/types";

export interface WidgetTemplateLibrary {
  get(name: string): WidgetTemplate;
  create<T extends State>(state: T): Widget<T>;
  register(name: string, template: WidgetTemplate);
}

export const WidgetTemplateLibraryModule = {
  $inject: [],
  $name: 'WidgetTemplateLibrary',
  $type: WidgetTemplateLibrary
}
function WidgetTemplateLibrary() : WidgetTemplateLibrary {
  const cache = new Map<string, WidgetTemplate>();

  function get(name: string) {
    return cache.get(name) || cache.get('default');
  }

  function create<T extends State>(state: T): Widget<T> {
    try {
      return get(state.type).createWidget(state);
    }
    catch(e) {
      console.log(`can't create Widget ${state.type}`);
      throw e;
    }
  }

  function register(name: string, template: WidgetTemplate): void {
    cache.set(name, template);
  }

  return {get, create, register}
}
