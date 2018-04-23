"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function DomGestureHandler(container, handler) {
    const document = container.ownerDocument;
    const setState = createStateHandler();
    setState(state0, container, handler);
    function state0(container, handler) {
        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseout", onMouseEnter);
        container.addEventListener("mousemove", onMouseMove);
        let hover = null;
        let hoverTime = 0;
        let hoverTimer = interval(900);
        let hoverEvent;
        resetHover(true);
        return () => {
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseout", onMouseEnter);
            container.removeEventListener("mousemove", onMouseMove);
            resetHover(false);
        };
        function onMouseDown(e) {
            e.preventDefault();
            let tol = handler.getDragTolerance(e);
            if (tol >= 0) {
                setState(state1, container, handler, e, tol);
                return;
            }
            let drag = handler.createDragHandler(e);
            if (!drag) {
                setState(state0, container, handler);
            }
            setState(state2, container, handler, drag, {
                pointerX: e.clientX,
                pointerY: e.clientY,
                targetElement: e.target
            });
        }
        function onMouseEnter(e) {
            handler.over(e);
        }
        function onMouseMove(e) {
            hoverTime = Date.now();
            hoverEvent = e;
            if (hover && hover.canCancel(e)) {
                resetHover(true);
            }
        }
        function hoverCallback() {
            if (Date.now() - hoverTime >= 1000) {
                hover = handler.createHoverHandler(hoverEvent);
                if (hover) {
                    hoverTimer();
                }
            }
        }
        function resetHover(restart) {
            if (hover) {
                hover.cancel(null);
                hover = null;
            }
            hoverTimer(restart ? hoverCallback : null);
        }
    }
    function state1(container, handler, e, tolerance) {
        document.addEventListener("mousedown", onMouseDown, true);
        document.addEventListener("mouseup", onMouseUp, true);
        document.addEventListener("mousemove", onMouseMove, true);
        const pointerX = e.clientX;
        const pointerY = e.clientY;
        const targetElement = e.target;
        const tapTimer = timeout(250);
        let mouseDownTime = Date.now();
        let tapCount = 0;
        let tapEvent = null;
        return () => {
            document.removeEventListener("mousedown", onMouseDown, true);
            document.removeEventListener("mouseup", onMouseUp, true);
            document.removeEventListener("mousemove", onMouseMove, true);
            tapTimer();
            tapEvent = null;
        };
        function onMouseDown(e) {
            mouseDownTime = Date.now();
            tapTimer();
            e.preventDefault();
        }
        function onMouseUp(e) {
            e.preventDefault();
            if (Date.now() - mouseDownTime >= 250) {
                setState(state0, container, handler);
                return;
            }
            tapCount++;
            tapTimer(onClickTimeout);
            tapEvent = e;
        }
        function onClickTimeout() {
            handler.tap(tapEvent, { tapCount });
            tapTimer();
            setState(state0, container, handler);
        }
        function onMouseMove(e) {
            e.preventDefault();
            if (Math.abs(e.clientX - pointerX) > tolerance || Math.abs(e.clientY - pointerY) > tolerance) {
                let drag = handler.createDragHandler(e);
                if (!drag) {
                    setState(state0, container, handler);
                    return;
                }
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
            if (firstMove) {
                drag.start(e, dragHandlerData);
                firstMove = false;
            }
            drag.move(e);
            e.preventDefault();
            e.stopPropagation();
        }
        function onMouseUp(e) {
            if (!firstMove) {
                drag.drop(e);
            }
            drag.cancel();
            setState(state0, container, handler);
            e.preventDefault();
            e.stopPropagation();
        }
        function onMouseOut(e) {
            drag.over(e);
            e.preventDefault();
            e.stopPropagation();
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
function interval(timeout) {
    let timer = 0;
    return (handler) => {
        if (timer)
            clearInterval(timer);
        timer = handler ? setInterval(handler, timeout) : 0;
    };
}
//# sourceMappingURL=dom-gesture-handler.js.map