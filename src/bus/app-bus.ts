import {createMouseDragBus, MouseDragBus} from "mouse-handlers/mouse-drag-bus";
import {createDiagramBus, DiagramBus} from "bus/diagram-bus";
import {createNodeHighlightBus, NodeHighlightBus} from "bus/node-hightlight-bus";
import {ExceptionCallback} from "../core/event-delegate";
import {createMouseDragDeferBus, MouseDragDeferBus} from "mouse-handlers/mouse-drag-deferred-bus";
import {createModelBus, ModelBus} from "bus/model-bus";
import {createStoreBus, StoreBus} from "bus/store-bus";

export interface AppBus extends MouseDragBus, MouseDragDeferBus, DiagramBus, NodeHighlightBus, ModelBus, StoreBus {
}

export const AppBusModule = {
  $inject: [],
  $name: 'AppBus',
  $type: AppBus
}

function AppBus(cbc: ExceptionCallback): AppBus {
  return Object.freeze({
    ...createMouseDragBus(cbc),
    ...createMouseDragDeferBus(cbc),
    ...createDiagramBus(cbc),
    ...createNodeHighlightBus(cbc),
    ...createModelBus(cbc),
    ...createStoreBus(cbc)
  });
}


