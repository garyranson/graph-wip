import {Injector, Module} from "core/injector";
import {WidgetTemplateLibraryModule} from "template/widget-template-library";
import {WidgetTemplateServiceModule} from "template/widget-template";
import {WidgetActionLibraryModule} from "template/widget-action-library";
import {IdGeneratorModule} from "modules/id-generator";
import {ShapeLibraryModule} from "modules/shape-library";

export function core(...modules:Module[]): Injector {
  return Injector(
    WidgetTemplateLibraryModule,
    WidgetTemplateServiceModule,
    WidgetActionLibraryModule,
    IdGeneratorModule,
    ShapeLibraryModule
  ).init(...modules);
}
