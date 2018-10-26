import {WidgetTemplate} from "./widget-template";
import {Widget} from "template/widget";
import {State} from "core/types";

export interface WidgetTemplateLibrary {
  getTemplate(name: string): WidgetTemplate;
  createWidget(state: State): Widget;
  register(name: string, template: WidgetTemplate);
}

export const WidgetTemplateLibraryModule = {
  $inject: [],
  $name: 'WidgetTemplateLibrary',
  $type: WidgetTemplateLibrary
}
function WidgetTemplateLibrary() {
  const cache = new Map<string, WidgetTemplate>();

  function getTemplate(name: string) {
    return cache.get(name) || cache.get('default');
  }

  function createWidget(state: State): Widget {
    return getTemplate(state.type).createWidget(state);
  }

  function register(name: string, template: WidgetTemplate): void {
    cache.set(name, template);
  }

  return {
    getTemplate,
    createWidget,
    register
  }
}
