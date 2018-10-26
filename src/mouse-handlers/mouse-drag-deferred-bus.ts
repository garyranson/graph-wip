import {createDelegate, DelegateCallbackCreator, EventDelegate} from "core/event-delegate";
import {WidgetActionEvent} from "drag-handlers/types";

export interface MouseDragDeferBus {
  mouseDragDefer: EventDelegate<WidgetActionEvent>;
}

export function createMouseDragDeferBus(callback?: DelegateCallbackCreator) : MouseDragDeferBus {
  return {
    mouseDragDefer: createDelegate<WidgetActionEvent>(callback),
  }
}
