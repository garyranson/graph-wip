import {createWidgetDragBus, WidgetBus} from "bus/widget-bus";
import {createDiagramBus, DiagramBus} from "bus/diagram-bus";
import {createNodeHighlightBus, NodeHighlightBus} from "bus/node-hightlight-bus";
import {ExceptionCallback} from "../core/event-delegate";
import {createModelBus, ModelBus} from "bus/model-bus";
import {createStoreBus, StoreBus} from "bus/store-bus";

export interface AppBus extends WidgetBus, DiagramBus, NodeHighlightBus, ModelBus, StoreBus {
}

export const AppBusModule = {
  $inject: [],
  $name: 'AppBus',
  $type: AppBus
}

function AppBus(cbc: ExceptionCallback): AppBus {
  return Object.freeze({
    ...createWidgetDragBus(cbc),
    ...createDiagramBus(cbc),
    ...createNodeHighlightBus(cbc),
    ...createModelBus(cbc),
    ...createStoreBus(cbc)
  });
}


