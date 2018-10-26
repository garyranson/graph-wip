import {defineModule, Injector} from "core/injector";

import {DragHandlersModule} from "drag-handlers/drag-handlers";
import {DelegateCallbackModule} from "modules/delegate-callback-initialiser";
import {WidgetLocatorModule} from "modules/widget-locator";
import {AppBus, AppBusModule} from "bus/app-bus";

import {NodeActionFeatureModule} from "features/widget-action-feature";
import {MouseFeatureModule} from "mouse-handlers/mouse-feature";
import {MouseDragFeatureModule} from "mouse-handlers/mouse-drag-feature";
import {WidgetHighlightFeatureModule} from "features/widget-highlight-feature";
import {DiagramContextMenuModule} from "features/diagram-context-menu-feature";
import {DiagramResizeModule} from "features/diagram-resize";
import {MouseDragDeferredFeatureModule} from "mouse-handlers/mouse-drag-deferred-feature";

import {WidgetTemplateLibraryModule} from "template/widget-template-library";

import {MoverDragHandlerModule} from "./drag-handlers/mover-drag-handler";
import {ResizerDragHandlerModule} from "./drag-handlers/resizer-drag-handler";
import {WidgetSelectionFeatureModule} from "./features/widget-selection-feature";
import {LassoDragHandlerModule} from "./drag-handlers/lasso-drag-handler";

import {DemoGraphBinderModule} from "./demo-graph-binder";
import {ModelControllerModule} from "modules/model-controller";
import {WidgetCanvasModule} from "modules/widget-canvas";
import {DemoTemplatesModule} from "./demo-templates";
import {ShadowWidgetFactoryModule} from "modules/shadow-widget-factory";
import {ConnectorDragHandlerModule} from "./drag-handlers/connector-drag-handler";
import {ContainerModule} from "modules/container-Initialiser";
import {SvgHelpersModule} from "modules/svg-helpers";
import {StoreModule} from "modules/store";
import {WidgetActionLibraryModule} from "template/widget-action-library";
import {WidgetTemplateServiceModule} from "template/widget-template";
import {ModelViewBridgeModule} from "features/model-view-bridge";
import {IdGeneratorModule} from "modules/id-generator";

export function bootstrap(container: any): void {
  try {
    const parent = Injector(
      WidgetTemplateLibraryModule,
      WidgetTemplateServiceModule,
      WidgetActionLibraryModule,
      IdGeneratorModule
    ).init(
      DemoTemplatesModule
    );
    bootstrap2(parent, container);
  }
  catch (e) {
    console.trace(e);
  }
}

function bootstrap2(injector: Injector, container: any): void {

  const app = injector.define(
    StoreModule,
    defineModule(
      ContainerModule,
      container
    ),
    ModelControllerModule,
    WidgetCanvasModule,
    AppBusModule,
    ShadowWidgetFactoryModule,
    SvgHelpersModule,
    WidgetLocatorModule,
    defineModule(
      DragHandlersModule,
      [
        LassoDragHandlerModule,
        MoverDragHandlerModule,
        ResizerDragHandlerModule,
        ConnectorDragHandlerModule
      ]
    ),
    defineModule(
      DelegateCallbackModule,
      callback
    )
  ).init(
    ModelViewBridgeModule,
    WidgetSelectionFeatureModule,
    MouseFeatureModule,
    NodeActionFeatureModule,
    MouseDragFeatureModule,
    MouseDragDeferredFeatureModule,
    WidgetHighlightFeatureModule,
    DiagramContextMenuModule,
    DiagramResizeModule,
    DemoGraphBinderModule
  );

  const bus = app.get<AppBus>('AppBus');

  bus.diagramInit.fire({container: app.get('Container')});
}

function callback(e) {
  console.trace(`**EVENT FAILURE: ${e}`)
}
