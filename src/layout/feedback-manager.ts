import {InjectCreator, Module} from "core/injector";
import {DragFeedbackFactory} from "core/types";

export interface DragFeedbackHandlers {
  get(string): DragFeedbackFactory;
}

export const DragFeedbackHandlersModule = {
  $type: DragFeedbackHandlers,
  $inject: ['$injectCreator'],
  $name: 'DragFeedbackHandlers'
}
function DragFeedbackHandlers(create: InjectCreator, modules: Module[]): DragFeedbackHandlers {
  const cache = modules.reduce(
    (map, module) => map.set(module.$item, create(module)),
    new Map<string, DragFeedbackFactory>()
  );
  return {
    get: (action: string)  => {
      return cache.get(action);
    }
  }
}

