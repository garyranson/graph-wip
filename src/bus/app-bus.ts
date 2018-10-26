import {createMouseDragBus, MouseDragBus} from "mouse-handlers/mouse-drag-bus";
import {createDiagramBus, DiagramBus} from "bus/diagram-bus";
import {createNodeHighlightBus, NodeHighlightBus} from "bus/node-hightlight-bus";
import {DelegateCallbackCreator} from "../core/event-delegate";
import {createMouseDragDeferBus, MouseDragDeferBus} from "mouse-handlers/mouse-drag-deferred-bus";
import {createNodeBus, NodeBus} from "bus/node-bus";
import {createStoreBus, StoreBus} from "bus/store-bus";

export interface AppBus extends MouseDragBus, MouseDragDeferBus, DiagramBus, NodeHighlightBus, NodeBus, StoreBus {
}

export const AppBusModule = {
  $inject: ['DelegateCallback'],
  $name: 'AppBus',
  $type: AppBus
}

function AppBus(cbc?: DelegateCallbackCreator): AppBus {
  return Object.freeze({
    ...createMouseDragBus(cbc),
    ...createMouseDragDeferBus(cbc),
    ...createDiagramBus(cbc),
    ...createNodeHighlightBus(cbc),
    ...createNodeBus(cbc),
    ...createStoreBus(cbc)
  });
}


