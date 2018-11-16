import {createDelegate, ExceptionCallback, EventDelegate} from "core/event-delegate";
import {WidgetActionClickEvent, WidgetActionEvent} from "drag-handlers/types";

export interface NodeEnterLeaveEvent {
  enter: string;
}


export interface NodeHighlightBus {
  nodeTrigger: EventDelegate<WidgetActionEvent>;
  nodeClick: EventDelegate<WidgetActionClickEvent>;
  nodeEnterLeave: EventDelegate<NodeEnterLeaveEvent>;
}

export function createNodeHighlightBus (callback?: ExceptionCallback) : NodeHighlightBus {
  return {
    nodeTrigger: createDelegate<WidgetActionEvent>(callback),
    nodeClick: createDelegate<WidgetActionClickEvent>(callback),
    nodeEnterLeave: createDelegate<NodeEnterLeaveEvent>(callback),
  }
}

