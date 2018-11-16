import {createDelegate, ExceptionCallback, EventDelegate} from "core/event-delegate";
import {WidgetActionEvent} from "drag-handlers/types";

export interface MouseDragBus {
  mouseDragRequest: EventDelegate<WidgetActionEvent>;
 // mouseDragComplete: EventDelegate<WidgetDragEvent>;
}

export function createMouseDragBus(callback?: ExceptionCallback): MouseDragBus {
  return {
    mouseDragRequest: createDelegate<WidgetActionEvent>(callback),
//    mouseDragComplete: createDelegate<WidgetDragEvent>(callback),
  }
}
