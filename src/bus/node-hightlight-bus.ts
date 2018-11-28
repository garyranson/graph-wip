import {createDelegate, ExceptionCallback, EventDelegate} from "core/event-delegate";
import {WidgetActionClickEvent, WidgetActionEvent} from "drag-handlers/types";

export interface WidgetEnterLeaveEvent {
  enter: string;
}

export interface NodeHighlightBus {
  widgetActionTrigger: EventDelegate<WidgetActionEvent>;
  widgetClick: EventDelegate<WidgetActionClickEvent>;
  widgetEnterLeave: EventDelegate<WidgetEnterLeaveEvent>;
}

export function createNodeHighlightBus (callback?: ExceptionCallback) : NodeHighlightBus {
  return {
    widgetActionTrigger: createDelegate<WidgetActionEvent>(callback),
    widgetClick: createDelegate<WidgetActionClickEvent>(callback),
    widgetEnterLeave: createDelegate<WidgetEnterLeaveEvent>(callback),
  }
}

