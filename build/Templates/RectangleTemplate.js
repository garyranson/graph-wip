System.register(["../Utils/svg"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var svg_1, RectangleTemplate;
    return {
        setters: [
            function (svg_1_1) {
                svg_1 = svg_1_1;
            }
        ],
        execute: function () {
            RectangleTemplate = class RectangleTemplate {
                redraw(bounds) {
                    return svg_1.createSvgElement("rect", {
                        x: 0,
                        y: 0,
                        width: bounds.width,
                        height: bounds.height
                    });
                }
            };
            exports_1("default", RectangleTemplate);
        }
    };
});
//# sourceMappingURL=RectangleTemplate.js.map