import {DragHandlerData, NodeAction} from "../types";
import GestureHandler from "./gesture-handler";
import DragHandler from "./drag-handler-base";
import {pointFromEvent} from "../Utils/svg-point";


export default function DomGestureHandler(container: Element, handler: GestureHandler) {
  const document = container.ownerDocument;
  const setState = createStateHandler();

  setState(state0, container, handler);

  container.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });


  function state0(container: Element, handler: GestureHandler) {
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseup", onMouseUp);
    container.addEventListener("mouseout", onMouseEnter);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseout", onMouseEnter);
      container.removeEventListener("mouseup", onMouseUp);
    };

    function onMouseUp(e: MouseEvent): void {
      e.preventDefault();
    }

    function onMouseDown(e: MouseEvent): void {
      e.preventDefault();

      const action = handler.over(e.target as Element);

      if (!action) return;

      handler.down(e);

      if (action.canDrag() && action.getDragTolerance() === 0) {
        let drag = handler.createDragHandler(e);

        const pt = pointFromEvent(container,e);

        setState(state2, container, handler, drag, true, {
          pointerX: pt.x,
          pointerY: pt.y,
          targetElement: e.target as Element
        });
      } else if (action.canClick()) {
        setState(state1, container, handler, e, action);
      }
    }

    function onMouseEnter(e: MouseEvent): void {
      handler.over(e.relatedTarget as Element);
    }
  }

  function state1(container: Element,
                  handler: GestureHandler,
                  e: MouseEvent,
                  action: NodeAction) {

    const pointer = pointFromEvent(container,e);
    const pointerX = e.clientX;
    const pointerY = e.clientY;
    const targetElement = e.target as Element;
    const tolerance = action.getDragTolerance();
    const tapTimer = timeout(250);
    const clickable = action.canClick();
    const draggable = action.canDrag();

    let mouseDownTime = Date.now();
    let tapCount = 0;

    document.addEventListener("mouseup", onMouseUp, true);
    if (clickable) document.addEventListener("mousedown", onMouseDown, true);
    if (draggable) document.addEventListener("mousemove", onMouseMove, true);

    return () => {
      document.removeEventListener("mouseup", onMouseUp, true);
      if (clickable) document.removeEventListener("mousedown", onMouseDown, true);
      if (draggable) document.removeEventListener("mousemove", onMouseMove, true);
      tapTimer();
    };

    function onMouseUp(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();

      if (clickable && Date.now() - mouseDownTime < 250) {
        // We're on a clickable field within the click timeout period
        tapCount++;
        tapTimer(() => {
          handler.clickHandler(tapCount, e);
          setState(state0, container, handler);
        });
      } else {
        setState(state0, container, handler);
      }
    }

    function onMouseDown(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      mouseDownTime = Date.now();
      tapTimer();
    }

    function onMouseMove(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();

      if (Math.abs(e.clientX - pointerX) <= tolerance && Math.abs(e.clientY - pointerY) <= tolerance) {
        return;
      }

      let drag = handler.createDragHandler(e);

      if (!drag) {
        setState(state0, container, handler);
      } else {
        setState(state2, container, handler, drag, false, {
          pointerX: pointer.x,
          pointerY: pointer.y,
          targetElement
        });
      }
    }
  }

  function state2(container: Element,
                  handler: GestureHandler,
                  drag: DragHandler,
                  immediate: boolean,
                  dragHandlerData: DragHandlerData) {

    const ptX = dragHandlerData.pointerX;
    const ptY = dragHandlerData.pointerY;
    let firstMove = true;

    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseout", onMouseOut, true);

    if (immediate) {
      drag.init(dragHandlerData);
    }

    return () => {
      document.removeEventListener("mouseup", onMouseUp, true);
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("mouseout", onMouseOut, true);
    };

    function onMouseMove(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();

      if (firstMove) {
        if (!immediate) drag.init(dragHandlerData);
        drag.start(e, dragHandlerData);
        firstMove = false;
      }
      const pt = pointFromEvent(container,e);
      drag.move(pt.x  - ptX, pt.y - ptY, e)
    }

    function onMouseUp(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      if (!firstMove) {
        const pt = pointFromEvent(container, e);
        drag.drop(pt.x - ptX, pt.y - ptY, e)
      }
      drag.cancel();
      setState(state0, container, handler);
    }

    function onMouseOut(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();
      drag.over(e);
    }
  }
}

function createStateHandler() {
  let currentState: () => void;

  return setState;

  function setState<T1>(state: (p1: T1) => () => void, p1: T1)
  function setState<T1, T2>(state: (p1: T1, p2: T2) => () => void, p1: T1, p2: T2)
  function setState<T1, T2, T3>(state: (p1: T1, p2: T2, p3: T3) => () => void, p1: T1, p2: T2, p3: T3)
  function setState<T1, T2, T3, T4>(state: (p1: T1, p2: T2, p3: T3, p4: T4) => () => void, p1: T1, p2: T2, p3: T3, p4: T4)
  function setState<T1, T2, T3, T4, T5>(state: (p1: T1, p2: T2, p3: T3, p4: T4, p5: T5) => () => void, p1: T1, p2: T2, p3: T3, p4: T4, p5: T5)
  function setState<T1, T2, T3, T4, T5>(state: (p1: T1, p2?: T2, p3?: T3, p4?: T4, p5?: T5) => () => void, p1: T1, p2?: T2, p3?: T3, p4?: T4, p5?: T5) {
    if (currentState) {
      currentState();
      currentState = null;
    }
    if (state) {
      const argc = arguments.length;
      currentState = argc >= 5
        ? state(p1, p2, p3, p4, p5)
        : argc >= 4
          ? state(p1, p2, p3, p4)
          : argc >= 3
            ? state(p1, p2, p3)
            : argc >= 2
              ? state(p1, p2)
              : state(p1);
    }
  }
}

function timeout(timeout: number) {
  let timer = 0;
  return (handler?: (...args: any[]) => void): void => {
    if (timer) clearTimeout(timer);
    timer = handler ? setTimeout(handler, timeout) : 0;
  };
}
