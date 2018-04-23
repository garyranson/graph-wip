System.register(["../util/utils", "../util/rectangle", "./drag-handler"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, rectangle_1, drag_handler_1, PxRubberband;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (rectangle_1_1) {
                rectangle_1 = rectangle_1_1;
            },
            function (drag_handler_1_1) {
                drag_handler_1 = drag_handler_1_1;
            }
        ],
        execute: function () {
            /**
             * Class: mxRubberband
             *
             * Event handler that selects rectangular regions. This is not built-into
             * <mxGraph>. To enable rubberband selection in a graph, use the following code.
             *
             * Example:
             *
             * (code)
             * let rubberband = new mxRubberband(graph);
             * (end)
             *
             * Constructor: mxRubberband
             *
             * Constructs an event handler that selects rectangular regions in the graph
             * using rubberband selection.
             */
            PxRubberband = class PxRubberband extends drag_handler_1.default {
                constructor() {
                    super(...arguments);
                    this.div = null;
                    this.currentX = 0;
                    this.currentY = 0;
                    this.defaultOpacity = 20;
                }
                start(e, data) {
                    const offset = utils_1.default.getOffset(this.graph.container);
                    const origin = utils_1.default.getScrollOrigin(this.graph.container);
                    this.pointX = (origin.x - offset.x) + data.pointerX;
                    this.pointY = (origin.y - offset.y) + data.pointerY;
                    this.div = this.createShape();
                    window.getSelection().removeAllRanges();
                }
                move(e) {
                    //console.log(`gdrag:${e.clientX}:${e.clientY}`);
                    const origin = utils_1.default.getScrollOrigin(this.graph.container);
                    const offset = utils_1.default.getOffset(this.graph.container);
                    origin.x -= offset.x;
                    origin.y -= offset.y;
                    this.currentX = (origin.x - offset.x) + e.clientX;
                    this.currentY = (origin.y - offset.y) + e.clientY;
                    this.repaint();
                }
                drop(evt) {
                    //console.log(`drop:${evt.clientX}:${evt.clientY}`);
                    if (this.bounds)
                        this.graph.selectRegion(this.bounds, evt);
                    this.reset();
                }
                /**
                 * Function: createShape
                 *
                 * Creates the rubberband selection shape.
                 */
                createShape() {
                    const div = document.createElement('div');
                    div.className = 'mxRubberband';
                    div.style.opacity = (this.defaultOpacity / 100);
                    this.graph.container.appendChild(div);
                    return div;
                }
                /**
                 * Function: reset
                 *
                 * Resets the state of the rubberband selection.
                 */
                reset() {
                    if (this.div) {
                        this.div.parentNode.removeChild(this.div);
                        this.div = null;
                    }
                }
                /**
                 * Function: repaint
                 *
                 * Computes the bounding box and updates the style of the <div>.
                 */
                repaint() {
                    const x = this.currentX - this.graph.panDx;
                    const y = this.currentY - this.graph.panDy;
                    const bounds = this.bounds = new rectangle_1.default(Math.min(this.pointX, x), Math.min(this.pointY, y), Math.max(1, Math.max(this.pointX, x) - Math.min(this.pointX, x)), Math.max(1, Math.max(this.pointY, y) - Math.min(this.pointY, y)));
                    this.div.style.left = `${bounds.x}px`;
                    this.div.style.top = `${bounds.y}px`;
                    this.div.style.width = `${bounds.width}px`;
                    this.div.style.height = `${bounds.height}px`;
                }
            };
            exports_1("default", PxRubberband);
        }
    };
});
//# sourceMappingURL=rubberband.js.map