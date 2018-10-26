import {State, StateIdType} from "core/types";

export interface WidgetDragEvent {
  x: number;
  y: number;
  dx: number;
  dy: number;
}


export interface WidgetActionEvent {
  type: string,
  x: number,
  y: number,
  element: Element,
  id: StateIdType,
  action: string,
  data: string,
  button: number,
  shiftKeys: number
}

export interface WidgetActionClickEvent extends WidgetActionEvent {
  clickCount: number,
}

export interface WidgetDragOverEvent extends WidgetDragEvent {
  id: StateIdType;
}

export interface WidgetDragDropEvent extends WidgetDragEvent {
  id: StateIdType;
}


export interface DragHandler {
  move(WidgetDragEvent),
  drop(WidgetDragDropEvent),
  over?(WidgetDragOverEvent),
  cancel()
}

export type DragHandlerFactory = (state: State, actionDate: string, x: number, y: number, config?: object) => DragHandler;

