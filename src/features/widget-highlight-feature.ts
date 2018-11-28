import {AppBus} from "bus/app-bus";
import {WidgetEnterLeaveEvent} from "bus/node-hightlight-bus";
import {StateIdType} from "core/types";
import {Graph} from "modules/graph";
import {ModelConstraints} from "modules/constraints";

export const WidgetHighlightFeatureModule = {
  $type: WidgetHighlightFeature,
  $inject: ['AppBus', 'Graph', 'ModelConstraints'],
  $name: 'WidgetHighlightFeature'
}

function WidgetHighlightFeature(appBus: AppBus, graph: Graph, constraints: ModelConstraints) {

  let currentNode: string;

  const nodeEnter = appBus.widgetEnterLeave.add((e: WidgetEnterLeaveEvent) => {
    //leave
    if (currentNode && (!e || currentNode !== e.enter)) {
      update(currentNode, 'off');
      currentNode = null;
    }
    //enter
    if (e && e.enter && constraints.isSelectable(e.enter)) {
      currentNode = e.enter;
      update(e.enter, 'on');
    }
  });

  function update(id: StateIdType, selectionState: "on"|"off"): void {
    appBus.widgetSelection.fire({
      type: 'hover',
      template: '$shape-highlight',
      selectionState,
      bounds: graph.getCanvasBounds(id),
      id
    });
  }

  const destroy = appBus.diagramDestroy.add(() => {
    appBus.diagramDestroy.remove(destroy);
    appBus.widgetEnterLeave.remove(nodeEnter);
  });
}
