import {createDelegate, ExceptionCallback, EventDelegate} from "core/event-delegate";
import {WidgetActionEvent} from "drag-handlers/types";
import {RectangleLike, StateIdType} from "core/types";

export interface WidgetBus {
  widgetDragRequest: EventDelegate<WidgetActionEvent>;
  widgetDragDefer: EventDelegate<WidgetActionEvent>;
  widgetDragAction: EventDelegate<WidgetDragActionEvent>;
  widgetSelection: EventDelegate<WidgetSelectionEvent>;
}

export interface WidgetSelectionEvent {
  id: StateIdType;
  bounds: RectangleLike;
  selectionState: "on"|"off",
  template?: string;
  type: string
}

export interface WidgetDragActionEvent {
  id: StateIdType;
  type: string;
}

export function createWidgetDragBus(callback?: ExceptionCallback): WidgetBus {
  return {
    widgetDragRequest: createDelegate<WidgetActionEvent>(callback),
    widgetDragDefer: createDelegate<WidgetActionEvent>(callback),
    widgetSelection: createDelegate<WidgetSelectionEvent>(callback),
    widgetDragAction: createDelegate<WidgetDragActionEvent>(callback)
  }
}
