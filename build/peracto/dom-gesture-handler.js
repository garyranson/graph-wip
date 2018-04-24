"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function DomGestureHandler(container, handler) {
    const document = container.ownerDocument;
    const setState = createStateHandler();
    setState(state0, container, handler);
    function state0(container, handler) {
        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseout", onMouseEnter);
        return () => {
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseout", onMouseEnter);
        };
        function onMouseDown(e) {
            e.preventDefault();
            const action = handler.getCurrentAction();
            if (!action)
                return;
            if (action.canDrag() && action.getDragTolerance() === 0) {
                let drag = action.createDragHandler(e);
                setState(state2, container, handler, drag, {
                    pointerX: e.clientX,
                    pointerY: e.clientY,
                    targetElement: e.target
                });
            }
            else if (action.canClick()) {
                setState(state1, container, handler, e, action);
            }
        }
        function onMouseEnter(e) {
            handler.over(e);
        }
    }
    function state1(container, handler, e, action) {
        const pointerX = e.clientX;
        const pointerY = e.clientY;
        const targetElement = e.target;
        const tolerance = action.getDragTolerance();
        const tapTimer = timeout(250);
        const clickable = action.canClick();
        const draggable = action.canDrag();
        let mouseDownTime = Date.now();
        let tapCount = 0;
        document.addEventListener("mouseup", onMouseUp, true);
        if (clickable)
            document.addEventListener("mousedown", onMouseDown, true);
        if (draggable)
            document.addEventListener("mousemove", onMouseMove, true);
        return () => {
            document.removeEventListener("mouseup", onMouseUp, true);
            if (clickable)
                document.removeEventListener("mousedown", onMouseDown, true);
            if (draggable)
                document.removeEventListener("mousemove", onMouseMove, true);
            tapTimer();
        };
        function onMouseUp(e) {
            e.preventDefault();
            if (clickable && Date.now() - mouseDownTime < 250) {
                // We're on a clickable field within the click timeout period
                tapCount++;
                tapTimer(() => {
                    action.tap(e, { tapCount });
                    setState(state0, container, handler);
                });
            }
            else {
                setState(state0, container, handler);
            }
        }
        function onMouseDown(e) {
            e.preventDefault();
            mouseDownTime = Date.now();
            tapTimer();
        }
        function onMouseMove(e) {
            e.preventDefault();
            if (Math.abs(e.clientX - pointerX) <= tolerance && Math.abs(e.clientY - pointerY) <= tolerance) {
                return;
            }
            let drag = action.createDragHandler(e);
            if (!drag) {
                setState(state0, container, handler);
            }
            else {
                setState(state2, container, handler, drag, {
                    pointerX,
                    pointerY,
                    targetElement
                });
            }
        }
    }
    function state2(container, handler, drag, dragHandlerData) {
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
        function onMouseMove(e) {
            e.preventDefault();
            e.stopPropagation();
            if (firstMove) {
                drag.start(e, dragHandlerData);
                firstMove = false;
            }
            drag.move(e);
        }
        function onMouseUp(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!firstMove) {
                drag.drop(e);
            }
            drag.cancel();
            setState(state0, container, handler);
        }
        function onMouseOut(e) {
            e.preventDefault();
            e.stopPropagation();
            drag.over(e);
        }
    }
}
exports.default = DomGestureHandler;
function createStateHandler() {
    let currentState;
    return setState;
    function setState(state, p1, p2, p3, p4) {
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
function timeout(timeout) {
    let timer = 0;
    return (handler) => {
        if (timer)
            clearTimeout(timer);
        timer = handler ? setTimeout(handler, timeout) : 0;
    };
}
//# sourceMappingURL=dom-gesture-handler.js.map