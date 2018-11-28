import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "template/shadow-widget-factory";
import {RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragEvent} from "./types";
import {ModelConstraints} from "modules/constraints";

export const ResizerDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory','ModelConstraints'],
  $name: 'ResizerDragHandler',
  $item: 'resizer',
  $type: ResizerDragHandler
}

function ResizerDragHandler(appBus: AppBus, shadowFactory: ShadowWidgetFactory,constraints: ModelConstraints): DragHandlerFactory {

  interface MoverFunction {
    (e: WidgetDragEvent): RectangleLike;
  }

  return (state: State, actionData: string, x: number, y: number) => {
    return createResizer(state as VertexState, actionData);
  }

  function createResizer(vertex: VertexState, position: string): DragHandler {
    const mover = moveFn(position);
    let shadow = shadowFactory.createVertex(vertex, '$shape-resize', 'tool');
    const {x, y, width, height} = vertex;
    const minSize = constraints.getMinSize(vertex);
    const maxSize = constraints.getMaxSize(vertex);

    return {move, drop, cancel}

    function move(e: WidgetDragEvent) {
      shadow.update(mover(e));
    }

    function drop(e: WidgetDragEvent) {
      appBus.resizeNode.fire({
        id: vertex.id,
        eventType: 'resize',
        bounds: shadow.getBounds()
      });
      cancel();
    }

    function cancel() {
      if (!shadow) return;
      shadow.remove();
      shadow = null;
    }

    function moveFn(position: string): MoverFunction {
      console.log('position:', position);
      return position === 'br'
        ? moveBR
        : position === 'tr'
          ? moveTR
          : position === 'tl'
            ? moveTL
            : position === 'bl'
              ? moveBL
              : noop as MoverFunction;
    }

    function moveBR(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width + e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height + e.dy, minSize.height), maxSize.height) - height);
      return {x, y, width: width + dx, height: height + dy};
    }

    function moveTR(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width + e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height - e.dy, minSize.height), maxSize.height) - height);
      return {x, y: y - dy, width: width + dx, height: height + dy};
    }

    function moveTL(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width - e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height - e.dy, minSize.height), maxSize.height) - height);
      return {x: x - dx, y: y - dy, width: width + dx, height: height + dy};
    }

    function moveBL(e: WidgetDragEvent): RectangleLike {
      const dx = Math.round(Math.min(Math.max(width - e.dx, minSize.width), maxSize.width) - width);
      const dy = Math.round(Math.min(Math.max(height + e.dy, minSize.height), maxSize.height) - height);
      return {x: x - dx, y, width: width + dx, height: height + dy};
    }
  }
}

function noop(): any {
}

/*



import {AppBus} from "bus/app-bus";
import {ShadowWidgetFactory} from "modules/shadow-widget-factory";
import {RectangleLike, State, VertexState} from "core/types";
import {DragHandler, DragHandlerFactory, WidgetDragEvent} from "./types";
import {ModelController} from "modules/model-controller";
import {ModelConstraints} from "modules/constraints";

export const ResizerDragHandlerModule = {
  $inject: ['AppBus', 'ShadowWidgetFactory', 'ModelController', 'ModelConstraints'],
  $name: 'ResizerDragHandler',
  $item: 'resizer',
  $type: ResizerDragHandler
}

function ResizerDragHandler(
  appBus: AppBus,
  shadowFactory: ShadowWidgetFactory,
  model: ModelController,
  constraints: ModelConstraints
): DragHandlerFactory {

  interface DxDy {
    dx: number;
    dy: number;
  }


  return (state: State, actionData: string, x: number, y: number) => {
    return createResizer(state as VertexState, actionData);
  }

  function createResizer(vertex: VertexState, position: string): DragHandler {
    const mover = moveFn(position);
    let shadow = shadowFactory.create(vertex, '$shape-resize', 'tool');
    const {x, y, width, height} = vertex;
    const minSize = constraints.getMinSize(vertex);
    const maxSize = constraints.getMaxSize(vertex);

    return {
      move: (e: WidgetDragEvent) => {
        console.log('const:',applyConstraints(e),e.dx,e.dy,minSize,maxSize,position);
        shadow.update(
          mover(
            applyConstraints(e)
          )
        );
      },
      drop,
      cancel
    }

    function applyConstraints(e: WidgetDragEvent): DxDy {
      return {
        dx: Math.round(Math.min(Math.max(width+ Math.abs(e.dx), minSize.width), maxSize.width) - width),
        dy: Math.round(Math.min(Math.max(height+ Math.abs(e.dy), minSize.height), maxSize.height) - height)
      }
    }

    function drop(e: WidgetDragEvent) {
      appBus.resizeNode.fire({
        id: vertex.id,
        eventType: 'resize',
        bounds: shadow.getBounds()
      });
      cancel();
    }

    function cancel() {
      if (!shadow) return;
      shadow.remove();
      shadow = null;
    }

  }
}

*/
