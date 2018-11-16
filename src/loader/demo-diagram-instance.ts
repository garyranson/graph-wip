import {defineModule, Injector} from "core/injector";
import {ModelControllerModule} from "modules/model-controller";
import {StoreModule} from "modules/store";
import {ContainerModule} from "modules/container-initialiser2";
import {TreeBuilderModule} from "features/tree-builder";
import {LayoutManagerModule} from "layout/layout-manager";
import {WidgetCanvasModule} from "modules/widget-canvas";
import {AppBusModule} from "bus/app-bus";
import {ShadowWidgetFactoryModule} from "modules/shadow-widget-factory";
import {WidgetLocatorModule} from "modules/widget-locator";
import {ContainmentManagerModule} from "modules/containment-manager";
import {ConnectionManagerModule} from "modules/connection-manager";
import {DragHandlersModule} from "drag-handlers/drag-handlers";
import {LassoDragHandlerModule} from "drag-handlers/lasso-drag-handler";
import {MoverDragHandlerModule} from "drag-handlers/mover-drag-handler";
import {ResizerDragHandlerModule} from "drag-handlers/resizer-drag-handler";
import {ConnectorDragHandlerModule} from "drag-handlers/connector-drag-handler";
import {ModelViewBridgeModule} from "features/model-view-bridge";
import {WidgetSelectionFeatureModule} from "features/widget-selection-feature";
import {MouseFeatureModule} from "mouse-handlers/mouse-feature";
import {NodeActionFeatureModule} from "features/widget-action-feature";
import {MouseDragFeatureModule} from "mouse-handlers/mouse-drag-feature";
import {MouseDragDeferredFeatureModule} from "mouse-handlers/mouse-drag-deferred-feature";
import {WidgetHighlightFeatureModule} from "features/widget-highlight-feature";
import {DiagramContextMenuModule} from "features/diagram-context-menu-feature";
import {DiagramResizeModule} from "features/diagram-resize";
import {ModelLoaderModule} from "modules/model-loader";

export function instance(injector: Injector,container: Element|string): Injector {
  return injector.define(
    StoreModule,
    defineModule(
      ContainerModule,
      container
    ),
    ModelControllerModule,
    ModelLoaderModule,
    TreeBuilderModule,
    LayoutManagerModule,
    WidgetCanvasModule,
    defineModule(
      AppBusModule,
      callback
    ),
    ShadowWidgetFactoryModule,
    WidgetLocatorModule,
    ContainmentManagerModule,
    ConnectionManagerModule,
    defineModule(
      DragHandlersModule,
      [
        LassoDragHandlerModule,
        MoverDragHandlerModule,
        ResizerDragHandlerModule,
        ConnectorDragHandlerModule
      ]
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
    DiagramResizeModule
  );
}

function callback(e) {
  console.trace(`**EVENT FAILURE: ${e}`)
}
