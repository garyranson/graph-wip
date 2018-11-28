import {defineModule, Injector} from "core/injector";
import {ModelControllerModule} from "modules/model-controller";
import {StoreModule} from "modules/graph";
import {ContainerModule} from "template/container-initialiser";
import {TreeBuilderModule} from "features/tree-builder";
import {LayoutManagerModule} from "layout/layout-manager";
import {WidgetCanvasModule} from "template/widget-controller";
import {AppBusModule} from "bus/app-bus";
import {ShadowWidgetFactoryModule} from "template/shadow-widget-factory";
import {WidgetLocatorModule} from "template/widget-locator";
import {ContainmentManagerModule} from "modules/containment-manager";
import {ConnectionManagerModule} from "modules/connection-manager";
import {DragHandlersModule} from "drag-handlers/drag-handlers";
import {LassoDragHandlerModule} from "drag-handlers/lasso-drag-handler";
import {MoverDragHandlerModule} from "drag-handlers/mover-drag-handler";
import {ResizerDragHandlerModule} from "drag-handlers/resizer-drag-handler";
import {ConnectorDragHandlerModule} from "drag-handlers/connector-drag-handler";
import {ModelViewBridgeModule} from "modules/model-view-bridge";
import {WidgetSelectionFeatureModule} from "features/widget-selection-feature";
import {MouseFeatureModule} from "mouse-handlers/mouse-feature";
import {NodeActionFeatureModule} from "features/widget-action-feature";
import {MouseDragFeatureModule} from "mouse-handlers/mouse-drag-feature";
import {MouseDragDeferredFeatureModule} from "mouse-handlers/mouse-drag-deferred-feature";
import {WidgetHighlightFeatureModule} from "features/widget-highlight-feature";
import {DiagramContextMenuModule} from "features/diagram-context-menu-feature";
import {DiagramResizeModule} from "features/diagram-resize";
import {ModelLoaderModule} from "modules/model-loader";
import {ModelConstraintsModule} from "modules/constraints";
import {WidgetSelectionModule} from "template/widget-selection";
import {DragFeedbackHandlersModule} from "layout/feedback-manager";
import {SimpleFeedbackModule} from "layout/fill-layout-feedback";
import {FlowFeedbackModule} from "layout/flow-layout-feedback";

export function instance(injector: Injector,container: Element|string): Injector {
  return injector.define(
    StoreModule,
    defineModule(
      ContainerModule,
      container
    ),
    ModelControllerModule,
    ModelConstraintsModule,
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
    ),
    defineModule(
      DragFeedbackHandlersModule,
      [
        SimpleFeedbackModule,
        FlowFeedbackModule
      ]
    ),
  ).init(
    WidgetSelectionModule,
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
