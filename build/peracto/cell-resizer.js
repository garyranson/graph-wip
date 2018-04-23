System.register(["../util/utils", "../util/rectangle", "./drag-handler", "../util/event", "../util/constants", "../util/point", "../shape/rectangle-shape"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, rectangle_1, drag_handler_1, event_1, constants_1, point_1, rectangle_shape_1, PxCellResizer;
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
            },
            function (event_1_1) {
                event_1 = event_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (point_1_1) {
                point_1 = point_1_1;
            },
            function (rectangle_shape_1_1) {
                rectangle_shape_1 = rectangle_shape_1_1;
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
            PxCellResizer = class PxCellResizer extends drag_handler_1.default {
                constructor(graph, data) {
                    super(graph, data);
                    this.singleSizer = false;
                    this.minBounds = null;
                    this.div = null;
                    this.currentX = 0;
                    this.currentY = 0;
                    this.defaultOpacity = 20;
                    this.index = parseInt(data.data);
                }
                init(data) {
                    console.log(data);
                }
                start(e, data) {
                    const handler = this.handler = this.graph.selectionCellsHandler.getHandler(this.state.cell);
                    this.selectionBorder = handler.selectionBorder;
                    this.selectionBounds = this.getSelectionBounds(this.state);
                    this.bounds = new rectangle_1.default(this.selectionBounds.x, this.selectionBounds.y, this.selectionBounds.width, this.selectionBounds.height);
                    //this.inTolerance = true;
                    this.childOffsetX = 0;
                    this.childOffsetY = 0;
                    this.startX = data.pointerX;
                    this.startY = data.pointerY;
                    // Saves reference to parent state
                    let model = this.state.view.graph.model;
                    let parent = model.getParent(this.state.cell);
                    if (this.state.view.currentRoot != parent && (model.isVertex(parent) || model.isEdge(parent))) {
                        this.parentState = this.state.view.graph.view.getState(parent);
                    }
                    // Creates a preview that can be on top of any HTML label
                    this.selectionBorder.node.style.display = (this.index == event_1.default.ROTATION_HANDLE) ? 'inline' : 'none';
                    // Creates the border that represents the new bounds
                    this.preview = this.createSelectionShape(this.bounds);
                    this.preview.init(this.graph.view.getOverlayPane());
                    // Prepares the handles for live preview
                    /* if (this.livePreview) {
                       this.hideSizers();
                
                       if (index == mxEvent.ROTATION_HANDLE) {
                         this.rotationShape.node.style.display = '';
                       }
                       else if (index == mxEvent.LABEL_HANDLE) {
                         this.labelShape.node.style.display = '';
                       }
                       else if (this.sizers != null && this.sizers[index] != null) {
                         this.sizers[index].node.style.display = '';
                       }
                       else if (index <= mxEvent.CUSTOM_HANDLE && this.customHandles != null) {
                         this.customHandles[mxEvent.CUSTOM_HANDLE - index].setVisible(true);
                       }
                
                       // Gets the array of connected edge handlers for redrawing
                       let edges = this.graph.getEdges(this.state.cell);
                       this.edgeHandlers = [];
                
                       for (let i = 0; i < edges.length; i++) {
                         let handler = this.graph.selectionCellsHandler.getHandler(edges[i]);
                
                         if (handler != null) {
                           this.edgeHandlers.push(handler);
                         }
                       }
                     }*/
                }
                /**
                 * Function: getSelectionBounds
                 *
                 * Returns the mxRectangle that defines the bounds of the selection
                 * border.
                 */
                getSelectionBounds(state) {
                    return new rectangle_1.default(Math.round(state.x), Math.round(state.y), Math.round(state.width), Math.round(state.height));
                }
                /**
                 * Function: createSelectionShape
                 *
                 * Creates the shape used to draw the selection border.
                 */
                createSelectionShape(bounds) {
                    let shape = new rectangle_shape_1.default(bounds.x, bounds.y, bounds.width, bounds.height, null, this.getSelectionColor());
                    shape.strokewidth = 1; //this.getSelectionStrokeWidth();
                    shape.isDashed = true; //this.isSelectionDashed();
                    return shape;
                }
                move(e) {
                    this.resizeVertex(e);
                    //this.updateHint(me);
                }
                /**
                 * Function: getSelectionColor
                 *
                 * Returns <mxConstants.VERTEX_SELECTION_COLOR>.
                 */
                getSelectionColor() {
                    return constants_1.default.VERTEX_SELECTION_COLOR;
                }
                /**
                 * Function: rotateVertex
                 *
                 * Rotates the vertex.
                 */
                resizeVertex(me) {
                    let ct = this.state.getCenterPt();
                    let alpha = utils_1.default.toRadians(this.state.style[constants_1.default.STYLE_ROTATION] || '0');
                    let point = new point_1.default(me.clientX, me.clientY);
                    let tr = this.graph.view.translate;
                    let cos = Math.cos(-alpha);
                    let sin = Math.sin(-alpha);
                    let dx = point.x - this.startX;
                    let dy = point.y - this.startY;
                    // Rotates vector for mouse gesture
                    let tx = cos * dx - sin * dy;
                    let ty = sin * dx + cos * dy;
                    dx = tx;
                    dy = ty;
                    let geo = this.graph.getCellGeometry(this.state.cell);
                    this.unscaledBounds = this.union(geo, dx, dy, this.index, this.graph.isGridEnabledEvent(me), 1, new point_1.default(0, 0), this.isConstrainedEvent(me), this.isCenteredEvent(this.state, me));
                    // Keeps vertex within maximum graph or parent bounds
                    if (!geo.relative) {
                        let max = this.graph.getMaximumGraphBounds();
                        // Handles child cells
                        if (max != null && this.parentState != null) {
                            max = rectangle_1.default.fromRectangle(max);
                            max.x -= (this.parentState.x - tr.x);
                            max.y -= (this.parentState.y - tr.y);
                        }
                        if (this.graph.isConstrainChild(this.state.cell)) {
                            let tmp = this.graph.getCellContainmentArea(this.state.cell);
                            if (tmp != null) {
                                let overlap = this.graph.getOverlap(this.state.cell);
                                if (overlap > 0) {
                                    tmp = rectangle_1.default.fromRectangle(tmp);
                                    tmp.x -= tmp.width * overlap;
                                    tmp.y -= tmp.height * overlap;
                                    tmp.width += 2 * tmp.width * overlap;
                                    tmp.height += 2 * tmp.height * overlap;
                                }
                                if (max == null) {
                                    max = tmp;
                                }
                                else {
                                    max = rectangle_1.default.fromRectangle(max);
                                    max.intersect(tmp);
                                }
                            }
                        }
                        if (max != null) {
                            if (this.unscaledBounds.x < max.x) {
                                this.unscaledBounds.width -= max.x - this.unscaledBounds.x;
                                this.unscaledBounds.x = max.x;
                            }
                            if (this.unscaledBounds.y < max.y) {
                                this.unscaledBounds.height -= max.y - this.unscaledBounds.y;
                                this.unscaledBounds.y = max.y;
                            }
                            if (this.unscaledBounds.x + this.unscaledBounds.width > max.x + max.width) {
                                this.unscaledBounds.width -= this.unscaledBounds.x +
                                    this.unscaledBounds.width - max.x - max.width;
                            }
                            if (this.unscaledBounds.y + this.unscaledBounds.height > max.y + max.height) {
                                this.unscaledBounds.height -= this.unscaledBounds.y +
                                    this.unscaledBounds.height - max.y - max.height;
                            }
                        }
                    }
                    this.bounds = new rectangle_1.default(((this.parentState != null) ? this.parentState.x : tr.x) + (this.unscaledBounds.x), ((this.parentState != null) ? this.parentState.y : tr.y) + (this.unscaledBounds.y), this.unscaledBounds.width, this.unscaledBounds.height);
                    if (geo.relative && this.parentState != null) {
                        this.bounds.x += this.state.x - this.parentState.x;
                        this.bounds.y += this.state.y - this.parentState.y;
                    }
                    cos = Math.cos(alpha);
                    sin = Math.sin(alpha);
                    let c2 = this.bounds.getCenterPt();
                    dx = c2.x - ct.x;
                    dy = c2.y - ct.y;
                    let dx2 = cos * dx - sin * dy;
                    let dy2 = sin * dx + cos * dy;
                    let dx3 = dx2 - dx;
                    let dy3 = dy2 - dy;
                    let dx4 = this.bounds.x - this.state.x;
                    let dy4 = this.bounds.y - this.state.y;
                    let dx5 = cos * dx4 - sin * dy4;
                    let dy5 = sin * dx4 + cos * dy4;
                    this.bounds.x += dx3;
                    this.bounds.y += dy3;
                    // Rounds unscaled bounds to int
                    this.unscaledBounds.x = Math.round(this.unscaledBounds.x + dx3);
                    this.unscaledBounds.y = Math.round(this.unscaledBounds.y + dy3);
                    this.unscaledBounds.width = Math.round(this.unscaledBounds.width);
                    this.unscaledBounds.height = Math.round(this.unscaledBounds.height);
                    // Shifts the children according to parent offset
                    if (!this.graph.isCellCollapsed(this.state.cell) && (dx3 != 0 || dy3 != 0)) {
                        this.childOffsetX = this.state.x - this.bounds.x + dx5;
                        this.childOffsetY = this.state.y - this.bounds.y + dy5;
                    }
                    else {
                        this.childOffsetX = 0;
                        this.childOffsetY = 0;
                    }
                    // if (this.livePreview) {
                    //   this.updateLivePreview(me);
                    // }
                    if (this.preview != null) {
                        this.drawPreview();
                    }
                }
                /**
                 * Function: drawPreview
                 *
                 * Redraws the preview.
                 */
                drawPreview() {
                    if (this.preview != null) {
                        this.preview.bounds = this.bounds;
                        if (this.preview.node.parentNode == this.graph.container) {
                            this.preview.bounds.width = Math.max(0, this.preview.bounds.width - 1);
                            this.preview.bounds.height = Math.max(0, this.preview.bounds.height - 1);
                        }
                        this.preview.rotation = Number(this.state.style[constants_1.default.STYLE_ROTATION] || '0');
                        this.preview.redraw();
                    }
                    this.selectionBorder.bounds = this.bounds;
                    this.selectionBorder.redraw();
                    //    if (this.parentHighlight != null) {
                    //    this.parentHighlight.redraw();
                    //}
                }
                /**
                 * Function: isConstrainedEvent
                 *
                 * Returns true if the aspect ratio if the cell should be maintained.
                 */
                isConstrainedEvent(me) {
                    return event_1.default.isShiftDown(me) || this.state.style[constants_1.default.STYLE_ASPECT] == 'fixed';
                }
                /**
                 * Function: isCenteredEvent
                 *
                 * Returns true if the center of the vertex should be maintained during the resize.
                 */
                isCenteredEvent(state, me) {
                    return false;
                }
                /**
                 * Function: union
                 *
                 * Returns the union of the given bounds and location for the specified
                 * handle index.
                 *
                 * To override this to limit the size of vertex via a minWidth/-Height style,
                 * the following code can be used.
                 *
                 * (code)
                 * let vertexHandlerUnion = mxVertexHandler.prototype.union;
                 * mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
                 * {
               *   let result = vertexHandlerUnion.apply(this, arguments);
               *
               *   result.width = Math.max(result.width, mxUtils.getNumber(this.state.style, 'minWidth', 0));
               *   result.height = Math.max(result.height, mxUtils.getNumber(this.state.style, 'minHeight', 0));
               *
               *   return result;
               * };
                 * (end)
                 *
                 * The minWidth/-Height style can then be used as follows:
                 *
                 * (code)
                 * graph.insertVertex(parent, null, 'Hello,', 20, 20, 80, 30, 'minWidth=100;minHeight=100;');
                 * (end)
                 *
                 * To override this to update the height for a wrapped text if the width of a vertex is
                 * changed, the following can be used.
                 *
                 * (code)
                 * let mxVertexHandlerUnion = mxVertexHandler.prototype.union;
                 * mxVertexHandler.prototype.union = function(bounds, dx, dy, index, gridEnabled, scale, tr, constrained)
                 * {
               *   let result = mxVertexHandlerUnion.apply(this, arguments);
               *   let s = this.state;
               *
               *   if (this.graph.isHtmlLabel(s.cell) && (index == 3 || index == 4) &&
               *       s.text != null && s.style[mxConstants.STYLE_WHITE_SPACE] == 'wrap')
               *   {
               *     let label = this.graph.getLabel(s.cell);
               *     let fontSize = mxUtils.getNumber(s.style, mxConstants.STYLE_FONTSIZE, mxConstants.DEFAULT_FONTSIZE);
               *     let ww = result.width / s.view.scale - s.text.spacingRight - s.text.spacingLeft
               *
               *     result.height = mxUtils.getSizeForString(label, fontSize, s.style[mxConstants.STYLE_FONTFAMILY], ww).height;
               *   }
               *
               *   return result;
               * };
                 * (end)
                 */
                union(bounds, dx, dy, index, gridEnabled, scale, tr, constrained, centered) {
                    if (this.singleSizer) {
                        let x = bounds.x + bounds.width + dx;
                        let y = bounds.y + bounds.height + dy;
                        if (gridEnabled) {
                            x = this.graph.snap(x);
                            y = this.graph.snap(y);
                        }
                        return new rectangle_1.default(bounds.x, bounds.y, 0, 0).addBounds(x, y, 0, 0);
                    }
                    let w0 = bounds.width;
                    let h0 = bounds.height;
                    let left = bounds.x - tr.x * scale;
                    let right = left + w0;
                    let top = bounds.y - tr.y * scale;
                    let bottom = top + h0;
                    let cx = left + w0 / 2;
                    let cy = top + h0 / 2;
                    if (index > 4 /* Bottom Row */) {
                        bottom = bottom + dy;
                        if (gridEnabled) {
                            bottom = this.graph.snap(bottom / scale) * scale;
                        }
                    }
                    else if (index < 3 /* Top Row */) {
                        top = top + dy;
                        if (gridEnabled) {
                            top = this.graph.snap(top / scale) * scale;
                        }
                    }
                    if (index == 0 || index == 3 || index == 5 /* Left */) {
                        left += dx;
                        if (gridEnabled) {
                            left = this.graph.snap(left / scale) * scale;
                        }
                    }
                    else if (index == 2 || index == 4 || index == 7 /* Right */) {
                        right += dx;
                        if (gridEnabled) {
                            right = this.graph.snap(right / scale) * scale;
                        }
                    }
                    let width = right - left;
                    let height = bottom - top;
                    if (constrained) {
                        let geo = this.graph.getCellGeometry(this.state.cell);
                        if (geo != null) {
                            let aspect = geo.width / geo.height;
                            if (index == 1 || index == 2 || index == 7 || index == 6) {
                                width = height * aspect;
                            }
                            else {
                                height = width / aspect;
                            }
                            if (index == 0) {
                                left = right - width;
                                top = bottom - height;
                            }
                        }
                    }
                    if (centered) {
                        width += (width - w0);
                        height += (height - h0);
                        let cdx = cx - (left + width / 2);
                        let cdy = cy - (top + height / 2);
                        left += cdx;
                        top += cdy;
                        //right += cdx;
                        //bottom += cdy;
                    }
                    // Flips over left side
                    if (width < 0) {
                        left += width;
                        width = Math.abs(width);
                    }
                    // Flips over top side
                    if (height < 0) {
                        top += height;
                        height = Math.abs(height);
                    }
                    return new rectangle_1.default(left + tr.x * scale, top + tr.y * scale, width, height);
                    /*
                        if (this.minBounds != null) {
                          result.width = Math.max(result.width, this.minBounds.x * scale + this.minBounds.width * scale + Math.max(0, this.x0 * scale - result.x));
                          result.height = Math.max(result.height, this.minBounds.y * scale + this.minBounds.height * scale + Math.max(0, this.y0 * scale - result.y));
                        }
                    */
                    //return result;
                }
                drop(evt) {
                    //console.log(`drop:${evt.clientX}:${evt.clientY}`);
                    if (!this.index || !this.state) {
                        return;
                    }
                    let point = new point_1.default(evt.clientX, evt.clientY);
                    this.graph.getModel().beginUpdate();
                    try {
                        let gridEnabled = this.graph.isGridEnabledEvent(evt);
                        let alpha = utils_1.default.toRadians(this.state.style[constants_1.default.STYLE_ROTATION] || '0');
                        let cos = Math.cos(-alpha);
                        let sin = Math.sin(-alpha);
                        let dx = point.x - this.startX;
                        let dy = point.y - this.startY;
                        // Rotates vector for mouse gesture
                        let tx = cos * dx - sin * dy;
                        let ty = sin * dx + cos * dy;
                        dx = tx;
                        dy = ty;
                        let recurse = this.isRecursiveResize();
                        this.resizeCell(this.state.cell, Math.round(dx), Math.round(dy), this.index, gridEnabled, this.isConstrainedEvent(evt), recurse);
                    }
                    finally {
                        this.graph.getModel().endUpdate();
                    }
                    this.reset();
                }
                /**
                 * Function: rotateCell
                 *
                 * Rotates the given cell to the given rotation.
                 */
                isRecursiveResize() {
                    return this.graph.isRecursiveResize(this.state);
                }
                /**
                 * Function: resizeCell
                 *
                 * Uses the given vector to change the bounds of the given cell
                 * in the graph using <mxGraph.resizeCell>.
                 */
                resizeCell(cell, dx, dy, index, gridEnabled, constrained, recurse) {
                    let geo = this.graph.model.getGeometry(cell);
                    if (geo == null) {
                        return;
                    }
                    if (this.unscaledBounds) {
                        if (this.childOffsetX != 0 || this.childOffsetY != 0) {
                            this.moveChildren(cell, Math.round(this.childOffsetX), Math.round(this.childOffsetY));
                        }
                        this.graph.resizeCell(cell, this.unscaledBounds, recurse);
                    }
                }
                /**
                 * Function: moveChildren
                 *
                 * Moves the children of the given cell by the given vector.
                 */
                moveChildren(cell, dx, dy) {
                    if (!cell)
                        return;
                    let graph = this.graph;
                    let model = graph.getModel();
                    cell.forEachChild((child) => {
                        let geo = graph.getCellGeometry(child);
                        if (geo) {
                            geo = geo.clone();
                            geo.translate(dx, dy);
                            model.setGeometry(child, geo);
                        }
                    });
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
                 * Resets the state of this handler.
                 */
                reset() {
                    if (this.preview) {
                        this.preview.destroy();
                        this.preview = null;
                    }
                    this.selectionBorder = null;
                    this.handler.reset();
                }
            };
            exports_1("default", PxCellResizer);
        }
    };
});
//# sourceMappingURL=cell-resizer.js.map