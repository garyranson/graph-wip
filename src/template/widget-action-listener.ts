import {AppBus} from "bus/app-bus";
import {WidgetDragActionEvent} from "bus/widget-bus";
import {ViewController} from "template/view-controller";

export const WidgetActionListenerModule = {
  $type: WidgetActionListener,
  $inject: ['AppBus', 'ViewController'],
  $name: 'WidgetActionListener'
}

function WidgetActionListener(appBus: AppBus, controller: ViewController): void {
  appBus.widgetDragAction.add((e: WidgetDragActionEvent) => {
    if (e.type === 'drag-start') {
      controller.addClass(e.id, 'px-drag');
    } else if (e.type === 'drag-end') {
      controller.removeClass(e.id, 'px-drag');
    }
  });
}
