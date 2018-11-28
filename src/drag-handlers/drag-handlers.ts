import {InjectCreator, Module} from "core/injector";
import {DragHandlerFactory} from "drag-handlers/types";

export interface DragHandlers {
  getFactory(action: string): DragHandlerFactory;
  getAction(action: string) : DragAction;
}

interface DragHandlerDefinition {
  action: DragAction,
  factory: DragHandlerFactory
}

type DragAction = "immediate"|"deffered"|"none";

export const DragHandlersModule = {
  $type: DragHandlers,
  $inject: ['$injectCreator'],
  $name: 'DragHandlers'
}
function DragHandlers(create: InjectCreator, modules: Module[]): DragHandlers {
  const cache = modules.reduce(
    (map,module) => map.set(module.$item, {action: "deffered", factory: create(module)}),
    new Map<string, DragHandlerDefinition>()
  );
  return {
    getAction: (action: string) => {
      const a = cache.get(action);
      return a?a.action:"none";
    },
    getFactory: (action: string) => {
      const f = cache.get(action);
      return f ? f.factory : undefined;
    }
  }

}

