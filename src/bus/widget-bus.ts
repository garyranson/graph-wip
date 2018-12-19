import {createDelegate, ExceptionCallback, EventDelegate} from "core/event-delegate";
import {WidgetActionEvent} from "drag-handlers/types";
import {StateIdType} from "core/types";

export interface WidgetBus {
  widgetDragRequest: EventDelegate<WidgetActionEvent>;
  widgetDragDefer: EventDelegate<WidgetActionEvent>;
  widgetDragAction: EventDelegate<WidgetDragActionEvent>;
}

export interface WidgetDragActionEvent {
  id: StateIdType;
  type: string;
}

export function createWidgetDragBus(callback?: ExceptionCallback): WidgetBus {
  return {
    widgetDragRequest: createDelegate<WidgetActionEvent>(callback),
    widgetDragDefer: createDelegate<WidgetActionEvent>(callback),
    widgetDragAction: createDelegate<WidgetDragActionEvent>(callback)
  }
}
