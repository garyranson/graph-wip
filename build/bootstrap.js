"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const injector_1 = require("core/injector");
const drag_handlers_1 = require("drag-handlers/drag-handlers");
const delegate_callback_initialiser_1 = require("modules/delegate-callback-initialiser");
const widget_locator_1 = require("modules/widget-locator");
const app_bus_1 = require("bus/app-bus");
const widget_action_feature_1 = require("features/widget-action-feature");
const mouse_feature_1 = require("mouse-handlers/mouse-feature");
const mouse_drag_feature_1 = require("mouse-handlers/mouse-drag-feature");
const widget_highlight_feature_1 = require("features/widget-highlight-feature");
const diagram_context_menu_feature_1 = require("features/diagram-context-menu-feature");
const diagram_resize_1 = require("features/diagram-resize");
const mouse_drag_deferred_feature_1 = require("mouse-handlers/mouse-drag-deferred-feature");
const widget_template_library_1 = require("template/widget-template-library");
const mover_drag_handler_1 = require("./drag-handlers/mover-drag-handler");
const resizer_drag_handler_1 = require("./drag-handlers/resizer-drag-handler");
const widget_selection_feature_1 = require("./features/widget-selection-feature");
const lasso_drag_handler_1 = require("./drag-handlers/lasso-drag-handler");
const demo_graph_binder_1 = require("./demo-graph-binder");
const model_controller_1 = require("modules/model-controller");
const widget_canvas_1 = require("modules/widget-canvas");
const demo_templates_1 = require("./demo-templates");
const shadow_widget_factory_1 = require("modules/shadow-widget-factory");
const connector_drag_handler_1 = require("./drag-handlers/connector-drag-handler");
const container_Initialiser_1 = require("modules/container-Initialiser");
const svg_helpers_1 = require("modules/svg-helpers");
const store_1 = require("modules/store");
const widget_action_library_1 = require("template/widget-action-library");
const widget_template_1 = require("template/widget-template");
const model_view_bridge_1 = require("features/model-view-bridge");
const id_generator_1 = require("modules/id-generator");
function bootstrap(container) {
    try {
        const parent = injector_1.Injector(widget_template_library_1.WidgetTemplateLibraryModule, widget_template_1.WidgetTemplateServiceModule, widget_action_library_1.WidgetActionLibraryModule, id_generator_1.IdGeneratorModule).init(demo_templates_1.DemoTemplatesModule);
        bootstrap2(parent, container);
    }
    catch (e) {
        console.trace(e);
    }
}
exports.bootstrap = bootstrap;
function bootstrap2(injector, container) {
    const app = injector.define(store_1.StoreModule, injector_1.defineModule(container_Initialiser_1.ContainerModule, container), model_controller_1.ModelControllerModule, widget_canvas_1.WidgetCanvasModule, app_bus_1.AppBusModule, shadow_widget_factory_1.ShadowWidgetFactoryModule, svg_helpers_1.SvgHelpersModule, widget_locator_1.WidgetLocatorModule, injector_1.defineModule(drag_handlers_1.DragHandlersModule, [
        lasso_drag_handler_1.LassoDragHandlerModule,
        mover_drag_handler_1.MoverDragHandlerModule,
        resizer_drag_handler_1.ResizerDragHandlerModule,
        connector_drag_handler_1.ConnectorDragHandlerModule
    ]), injector_1.defineModule(delegate_callback_initialiser_1.DelegateCallbackModule, callback)).init(model_view_bridge_1.ModelViewBridgeModule, widget_selection_feature_1.WidgetSelectionFeatureModule, mouse_feature_1.MouseFeatureModule, widget_action_feature_1.NodeActionFeatureModule, mouse_drag_feature_1.MouseDragFeatureModule, mouse_drag_deferred_feature_1.MouseDragDeferredFeatureModule, widget_highlight_feature_1.WidgetHighlightFeatureModule, diagram_context_menu_feature_1.DiagramContextMenuModule, diagram_resize_1.DiagramResizeModule, demo_graph_binder_1.DemoGraphBinderModule);
    const bus = app.get('AppBus');
    bus.diagramInit.fire({ container: app.get('Container') });
}
function callback(e) {
    console.trace(`**EVENT FAILURE: ${e}`);
}
//# sourceMappingURL=bootstrap.js.map