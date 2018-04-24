import {DragHandlerData} from "../types";
import GestureHandler, {GestureHub} from "./gesture-handler";
import DragHandler from "./drag-handler";

export default function DomGestureHandler(container: Element, handler: GestureHandler) {
  const document = container.ownerDocument;
  const setState = createStateHandler();

  setState(state0, container, handler);

  function state0(container: Element, handler: GestureHandler) {
    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mouseout", onMouseEnter);

    return () => {
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mouseout", onMouseEnter);
    };

    function onMouseDown(e: MouseEvent): void {
      e.preventDefault();

      const action = handler.getCurrentAction();

      if(!action) return;

      if(action.canDrag() && action.getDragTolerance()===0) {
        let drag = action.createDragHandler(e);

        setState(state2, container, handler, drag, {
          pointerX: e.clientX,
          pointerY: e.clientY,
          targetElement: e.target as Element
        });
      } else if(action.canClick()) {
        setState(state1, container, handler, e, action);
      }
    }

    function onMouseEnter(e: MouseEvent): void {
      handler.over(e);
    }
  }

  function state1(container: Element,
                  handler: GestureHandler,
                  e: MouseEvent,
                  action: GestureHub) {

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
    if(clickable) document.addEventListener("mousedown", onMouseDown, true);
    if(draggable) document.addEventListener("mousemove", onMouseMove, true);


    return () => {
      document.removeEventListener("mouseup", onMouseUp, true);
      if(clickable) document.removeEventListener("mousedown", onMouseDown, true);
      if(draggable) document.removeEventListener("mousemove", onMouseMove, true);
      tapTimer();
    };

    function onMouseUp(e: MouseEvent): void {
      e.preventDefault();

      if (clickable && Date.now() - mouseDownTime < 250) {
        // We're on a clickable field within the click timeout period
        tapCount++;
        tapTimer(() => {
          action.tap(e,{tapCount})
          setState(state0, container, handler);
        });
      } else {
        setState(state0, container, handler);
      }
    }

    function onMouseDown(e: MouseEvent): void {
      e.preventDefault();
      mouseDownTime = Date.now();
      tapTimer();
    }

    function onMouseMove(e: MouseEvent): void {
      e.preventDefault();

      if (Math.abs(e.clientX - pointerX) <= tolerance && Math.abs(e.clientY - pointerY) <= tolerance) {
        return;
      }

      let drag = action.createDragHandler(e);

      if (!drag) {
        setState(state0, container, handler);
      } else {
        setState(state2, container, handler, drag, {
          pointerX,
          pointerY,
          targetElement
        });
      }
    }
  }

  function state2(container: Element,
                  handler: GestureHandler,
                  drag: DragHandler,
                  dragHandlerData: DragHandlerData) {

    document.addEventListener("mouseup", onMouseUp, true);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("mouseout", onMouseOut, true);
    let firstMove = true;

    drag.init(dragHandlerData);

    return () => {
      document.removeEventListener("mouseup", onMouseUp, true);
      document.removeEventListener("mousemove", onMouseMove, true);
      document.removeEventListener("mouseout", onMouseOut, true);
    };

    function onMouseMove(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();

      if (firstMove) {
        drag.start(e, dragHandlerData);
        firstMove = false;
      }
      drag.move(e);
    }

    function onMouseUp(e: MouseEvent): void {
      e.preventDefault();
      e.stopPropagation();

      if (!firstMove) {
        drag.drop(e);
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
  function setState<T1, T2, T3, T4>(state: (p1: T1, p2?: T2, p3?: T3, p4?: T4) => () => void, p1: T1, p2?: T2, p3?: T3, p4?: T4)
  {
    if (currentState) {
      currentState();
      currentState = null;
    }
    if (state) {
      const argc = arguments.length;
      currentState = argc >= 4
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
