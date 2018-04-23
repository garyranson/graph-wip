System.register(["./gesture-handler", "./dom-gesture-handler"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function GraphGestureBinder(graph) {
        dom_gesture_handler_1.default(graph.container, new gesture_handler_1.default(graph));
    }
    exports_1("GraphGestureBinder", GraphGestureBinder);
    var gesture_handler_1, dom_gesture_handler_1;
    return {
        setters: [
            function (gesture_handler_1_1) {
                gesture_handler_1 = gesture_handler_1_1;
            },
            function (dom_gesture_handler_1_1) {
                dom_gesture_handler_1 = dom_gesture_handler_1_1;
            }
        ],
        execute: function () {
        }
    };
});
//# sourceMappingURL=graph-gesture-binder.js.map