import {AppBus} from "bus/app-bus";
import {WidgetEnterLeaveEvent} from "bus/node-hightlight-bus";
import {Graph} from "modules/graph";
import {ModelConstraints} from "modules/constraints";
import {CursorManager} from "template/cursor-manager";
import {Widget} from "template/widget";

export const WidgetHighlightFeatureModule = {
  $type: WidgetHighlightFeature,
  $inject: ['AppBus', 'Graph', 'ModelConstraints','CursorManager'],
  $name: 'WidgetHighlightFeature'
}

function WidgetHighlightFeature(appBus: AppBus, graph: Graph, constraints: ModelConstraints, cursorManager: CursorManager) {

  let activeWidget: Widget;
  let activeShape: string;
  let activeId: string;

  const nodeEnter = appBus.widgetEnterLeave.add((e: WidgetEnterLeaveEvent) => {

    if (activeWidget) {
      cursorManager.releaseLinked(activeShape, activeWidget, activeId);
      activeWidget = null;
      activeId = null;
      activeShape = null;
    }

    if (e && e.enter && constraints.isSelectable(e.enter)) {
      activeId = e.enter;
      activeShape = graph.getClass(activeId) === 'vertex' ? '$shape-highlight' : '$edge-highlight';
      activeWidget = cursorManager
        .createLinked(activeShape, activeId)
        .removeClass('px-off');
    }
  });

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.widgetEnterLeave.remove(nodeEnter);
  });



}
