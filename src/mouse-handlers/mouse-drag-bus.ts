import {createDelegate, DelegateCallbackCreator, EventDelegate} from "core/event-delegate";
import {WidgetActionEvent, WidgetDragEvent} from "drag-handlers/types";

export interface MouseDragBus {
  mouseDragRequest: EventDelegate<WidgetActionEvent>;
  mouseDragComplete: EventDelegate<WidgetDragEvent>;
}

export function createMouseDragBus(callback?: DelegateCallbackCreator): MouseDragBus {
  return {
    mouseDragRequest: createDelegate<WidgetActionEvent>(callback),
    mouseDragComplete: createDelegate<WidgetDragEvent>(callback),
  }
}
