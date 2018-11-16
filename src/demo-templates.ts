import {WidgetTemplateLibrary} from "template/widget-template-library";
import {WidgetTemplateService} from "template/widget-template";

export const DemoTemplatesModule = {
  $inject: ['WidgetTemplateLibrary', 'WidgetTemplateService'],
  $name: 'demoTemplates',
  $type: demoTemplates
}

function demoTemplates(library: WidgetTemplateLibrary, widgetService: WidgetTemplateService,els: Element[]) {
  els && els.forEach((e) => library.register(getId(e), widgetService.create(e)));
}

function getId(e: Element) : string {
  try {
    return e.getAttribute('id');
  }
  finally {
    e.removeAttribute('id');
  }
}
