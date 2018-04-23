System.register(["../util/rectangle", "./drag-handler", "../view/guide", "../util/utils", "../util/point", "../util/constants", "../handler/cell-highlight", "../shape/rectangle-shape", "../client", "../util/event"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var rectangle_1, drag_handler_1, guide_1, utils_1, point_1, constants_1, cell_highlight_1, rectangle_shape_1, client_1, event_1, PxCellDragger;
    return {
        setters: [
            function (rectangle_1_1) {
                rectangle_1 = rectangle_1_1;
            },
            function (drag_handler_1_1) {
                drag_handler_1 = drag_handler_1_1;
            },
            function (guide_1_1) {
                guide_1 = guide_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (point_1_1) {
                point_1 = point_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (cell_highlight_1_1) {
                cell_highlight_1 = cell_highlight_1_1;
            },
            function (rectangle_shape_1_1) {
                rectangle_shape_1 = rectangle_shape_1_1;
            },
            function (client_1_1) {
                client_1 = client_1_1;
            },
            function (event_1_1) {
                event_1 = event_1_1;
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
            PxCellDragger = class PxCellDragger extends drag_handler_1.default {
                constructor() {
                    super(...arguments);
                    this.guidesEnabled = true;
                    this.delayedSelection = false;
                    this.minimumSize = 20;
                    this.previewColor = 'blue';
                    this.connectOnDrop = false;
                    /**
                     * Variable: highlightEnabled
                     *
                     * Specifies if drop targets under the mouse should be enabled. Default is
                     * true.
                     */
                    this.highlightEnabled = true;
                    this.currentDx = 0;
                    this.currentDy = 0;
                    this.moveEnabled = true;
                    this.cloneEnabled = true;
                    this.removeCellsFromParent = true;
                    this.selectEnabled = true;
                    /**
                     * Variable: scrollOnMove
                     *
                     * Specifies if the view should be scrolled so that a moved cell is
                     * visible. Default is true.
                     */
                    this.scrollOnMove = true;
                }
                start(e, data) {
                    this.first = utils_1.default.convertPoint(this.graph.container, data.pointerX, data.pointerY);
                    this.cells = this.getCells(this.cell);
                    this.bounds = this.graph.getView().getBounds(this.cells);
                    this.pBounds = this.getPreviewBounds(this.cells);
                    if (this.guidesEnabled) {
                        this.guide = new guide_1.default(this.graph, this.getGuideStates());
                    }
                }
                /**
                 * Function: getGuideStates
                 *
                 * Creates an array of cell states which should be used as guides.
                 */
                getGuideStates() {
                    let parent = this.graph.getDefaultParent();
                    let model = this.graph.getModel();
                    return this.graph.view.getCellStates(model.filterDescendants((cell) => {
                        return this.graph.view.getState(cell) != null &&
                            model.isVertex(cell) &&
                            model.getGeometry(cell) != null &&
                            !model.getGeometry(cell).relative;
                    }, parent));
                }
                /**
                 * Function: getCells
                 *
                 * Returns the cells to be modified by this handler. This implementation
                 * returns all selection cells that are movable, or the given initial cell if
                 * the given cell is not selected and movable. This handles the case of moving
                 * unselectable or unselected cells.
                 *
                 * Parameters:
                 *
                 * initialCell - <mxCell> that triggered this handler.
                 */
                getCells(initialCell) {
                    return !this.delayedSelection && this.graph.isCellMovable(initialCell)
                        ? [initialCell]
                        : this.graph.getMovableCells(this.graph.getSelectionCells());
                }
                /**
                 * Function: getPreviewBounds
                 *
                 * Returns the <mxRectangle> used as the preview bounds for
                 * moving the given cells.
                 */
                getPreviewBounds(cells) {
                    let bounds = this.getBoundingBox(cells);
                    if (bounds != null) {
                        // Corrects width and height
                        bounds.width = Math.max(0, bounds.width - 1);
                        bounds.height = Math.max(0, bounds.height - 1);
                        if (bounds.width < this.minimumSize) {
                            let dx = this.minimumSize - bounds.width;
                            bounds.x -= dx / 2;
                            bounds.width = this.minimumSize;
                        }
                        else {
                            bounds.x = Math.round(bounds.x);
                            bounds.width = Math.ceil(bounds.width);
                        }
                        // let tr = this.graph.view.translate;
                        // let s = this.graph.view.scale;
                        if (bounds.height < this.minimumSize) {
                            let dy = this.minimumSize - bounds.height;
                            bounds.y -= dy / 2;
                            bounds.height = this.minimumSize;
                        }
                        else {
                            // noinspection JSSuspiciousNameCombination
                            bounds.y = Math.round(bounds.y);
                            // noinspection JSSuspiciousNameCombination
                            bounds.height = Math.ceil(bounds.height);
                        }
                    }
                    return bounds;
                }
                /**
                 * Function: getBoundingBox
                 *
                 * Returns the union of the <mxCellStates> for the given array of <mxCells>.
                 * For vertices, this method uses the bounding box of the corresponding shape
                 * if one exists. The bounding box of the corresponding text label and all
                 * controls and overlays are ignored. See also: <mxGraphView.getBounds> and
                 * <mxGraph.getBoundingBox>.
                 *
                 * Parameters:
                 *
                 * cells - Array of <mxCells> whose bounding box should be returned.
                 */
                getBoundingBox(cells) {
                    let result = null;
                    if (cells != null && cells.length > 0) {
                        let model = this.graph.getModel();
                        for (let i = 0; i < cells.length; i++) {
                            if (!model.isVertex(cells[i]) && !model.isEdge(cells[i])) {
                                continue;
                            }
                            let state = this.graph.view.getState(cells[i]);
                            if (!state) {
                                continue;
                            }
                            let bbox = state;
                            if (model.isVertex(cells[i]) && state.shape != null && state.shape.boundingBox != null) {
                                bbox = state.shape.boundingBox;
                            }
                            if (!result) {
                                result = rectangle_1.default.fromRectangle(bbox);
                            }
                            else {
                                result.add(bbox);
                            }
                        }
                    }
                    return result;
                }
                /**
                 * Function: getDelta
                 *
                 * Returns an <mxPoint> that represents the vector for moving the cells
                 * for the given <mxMouseEvent>.
                 */
                getDelta(me) {
                    let point = utils_1.default.convertPoint(this.graph.container, me.clientX, me.clientY);
                    return new point_1.default(Math.round(point.x - this.first.x), Math.round(point.y - this.first.y));
                }
                move(me) {
                    let graph = this.graph;
                    let delta = this.getDelta(me);
                    let dx = delta.x;
                    let dy = delta.y;
                    let tol = graph.tolerance;
                    if (this.shape != null || Math.abs(dx) > tol || Math.abs(dy) > tol) {
                        // Highlight is used for highlighting drop targets
                        if (this.highlight == null) {
                            this.highlight = new cell_highlight_1.default(this.graph, constants_1.default.DROP_TARGET_COLOR, 3);
                        }
                        if (this.shape == null) {
                            this.shape = this.createPreviewShape(this.bounds);
                        }
                        let gridEnabled = graph.isGridEnabledEvent(me);
                        let hideGuide = true;
                        if (this.guide != null && this.useGuidesForEvent(me)) {
                            delta = this.guide.move(this.bounds, new point_1.default(dx, dy), gridEnabled);
                            hideGuide = false;
                            dx = delta.x;
                            dy = delta.y;
                        }
                        else if (gridEnabled) {
                            let trx = graph.getView().translate;
                            let tx = this.bounds.x - (graph.snap(this.bounds.x - trx.x) + trx.x);
                            let ty = this.bounds.y - (graph.snap(this.bounds.y - trx.y) + trx.y);
                            let v = this.snap(new point_1.default(dx, dy));
                            dx = v.x - tx;
                            dy = v.y - ty;
                        }
                        if (this.guide != null && hideGuide) {
                            this.guide.hide();
                        }
                        // Constrained movement if shift key is pressed
                        if (graph.isConstrainedEvent(me)) {
                            if (Math.abs(dx) > Math.abs(dy)) {
                                dy = 0;
                            }
                            else {
                                dx = 0;
                            }
                        }
                        this.currentDx = dx;
                        this.currentDy = dy;
                        this.updatePreviewShape();
                        let target = null;
                        //let cell = me.getCell(); //TODO: NEED TO DOUBLE check if this is the cell at the point - or the source cell
                        let cell = this.state.cell; //TODO: NEED TO DOUBLE check if this is the cell at the point - or the source cell
                        let clone = graph.isCloneEvent(me) && graph.isCellsCloneable() && this.isCloneEnabled();
                        if (graph.isDropEnabled() && this.highlightEnabled) {
                            // Contains a call to getCellAt to find the cell under the mouse
                            target = graph.getDropTarget(this.cells, me, cell, clone);
                        }
                        let state = graph.getView().getState(target);
                        let highlight = false;
                        if (state != null && (graph.model.getParent(this.cell) != target || clone)) {
                            if (this.target != target) {
                                this.target = target;
                                this.setHighlightColor(constants_1.default.DROP_TARGET_COLOR);
                            }
                            highlight = true;
                        }
                        else {
                            this.target = null;
                            if (this.connectOnDrop && cell != null && this.cells.length == 1 &&
                                graph.getModel().isVertex(cell) && graph.isCellConnectable(cell)) {
                                state = graph.getView().getState(cell);
                                if (state != null) {
                                    let error = graph.getEdgeValidationError(null, this.cell, cell);
                                    let color = (error == null) ?
                                        constants_1.default.VALID_COLOR :
                                        constants_1.default.INVALID_CONNECT_TARGET_COLOR;
                                    this.setHighlightColor(color);
                                    highlight = true;
                                }
                            }
                        }
                        if (state && highlight) {
                            this.highlight.highlight(state);
                        }
                        else {
                            this.highlight.hide();
                        }
                    }
                    //this.consumeMouseEvent(mxEvent.MOUSE_MOVE, me);
                    // Cancels the bubbling of events to the container so
                    // that the droptarget is not reset due to an mouseMove
                    // fired on the container with no associated state.
                    //mxEvent.consume(me.getEvent());
                }
                /**
                 * Function: setHighlightColor
                 *
                 * Sets the color of the rectangle used to highlight drop targets.
                 *
                 * Parameters:
                 *
                 * color - String that represents the new highlight color.
                 */
                setHighlightColor(color) {
                    if (this.highlight != null) {
                        this.highlight.setHighlightColor(color);
                    }
                }
                /**
                 * Function: updatePreviewShape
                 *
                 * Updates the bounds of the preview shape.
                 */
                updatePreviewShape() {
                    if (!this.shape)
                        return;
                    this.shape.bounds = new rectangle_1.default(Math.round(this.pBounds.x + this.currentDx - this.graph.panDx), Math.round(this.pBounds.y + this.currentDy - this.graph.panDy), this.pBounds.width, this.pBounds.height);
                    this.shape.redraw();
                }
                /**
                 * Function: 4
                 *
                 * Snaps the given vector to the grid and returns the given mxPoint instance.
                 */
                snap(vector) {
                    vector.x = this.graph.snap(vector.x);
                    vector.y = this.graph.snap(vector.y);
                    return vector;
                }
                /**
                 * Function: useGuidesForEvent
                 *
                 * Returns true if the guides should be used for the given <mxMouseEvent>.
                 * This implementation returns <mxGuide.isEnabledForEvent>.
                 */
                useGuidesForEvent(me) {
                    return this.guide ? this.guide.isEnabledForEvent(me) : true;
                }
                /**
                 * Function: createPreviewShape
                 *
                 * Creates the shape used to draw the preview for the given bounds.
                 */
                createPreviewShape(bounds) {
                    let shape = new rectangle_shape_1.default(bounds.x, bounds.y, bounds.width, bounds.height, null, this.previewColor);
                    shape.isDashed = true;
                    shape.init(this.graph.getView().getOverlayPane());
                    shape.pointerEvents = false;
                    // Workaround for artifacts on iOS
                    if (client_1.default.IS_IOS) { //TODO: Review this
                        shape.getSvgScreenOffset = function () {
                            return 0;
                        };
                    }
                    return shape;
                }
                /**
                 * Function: isCloneEnabled
                 *
                 * Returns <cloneEnabled>.
                 */
                isCloneEnabled() {
                    return this.cloneEnabled;
                }
                /**
                 * Function: setCloneEnabled
                 *
                 * Sets <cloneEnabled>.
                 *
                 * Parameters:
                 *
                 * value - Boolean that specifies the new clone enabled state.
                 */
                setCloneEnabled(value) {
                    this.cloneEnabled = value;
                }
                /**
                 * Function: isMoveEnabled
                 *
                 * Returns <moveEnabled>.
                 */
                isMoveEnabled() {
                    return this.moveEnabled;
                }
                /**
                 * Function: setMoveEnabled
                 *
                 * Sets <moveEnabled>.
                 */
                setMoveEnabled(value) {
                    this.moveEnabled = value;
                }
                drop(me) {
                    let graph = this.graph;
                    if (this.cell != null && this.first != null && this.shape != null &&
                        this.currentDx != null && this.currentDy != null) {
                        //let cell = me.getCell(); //TODO: Again, is this the cell under the cursor or the state.cell ?
                        let cell = this.state.cell;
                        if (this.connectOnDrop && this.target == null && cell != null && graph.getModel().isVertex(cell) &&
                            graph.isCellConnectable(cell) && graph.isEdgeValid(null, this.cell, cell)) {
                            graph.connectionHandler.connect(this.cell, cell, me);
                        }
                        else {
                            let clone = graph.isCloneEvent(me) && graph.isCellsCloneable() && this.isCloneEnabled();
                            let dx = Math.round(this.currentDx);
                            let dy = Math.round(this.currentDy);
                            let target = this.target;
                            if (graph.isSplitEnabled() && graph.isSplitTarget(target, this.cells, me)) {
                                graph.splitEdge(target, this.cells, null, dx, dy);
                            }
                            else {
                                this.moveCells(this.cells, dx, dy, clone, this.target, me);
                            }
                        }
                    }
                    else if (this.isSelectEnabled() && this.delayedSelection && this.cell != null) {
                        this.selectDelayed(me);
                    }
                    this.reset();
                }
                /**
                 * Function: moveCells
                 *
                 * Moves the given cells by the specified amount.
                 */
                moveCells(cells, dx, dy, clone, target, evt) {
                    if (clone) {
                        cells = this.graph.getCloneableCells(cells);
                    }
                    // Removes cells from parent
                    if (target == null && this.isRemoveCellsFromParent() &&
                        this.shouldRemoveCellsFromParent(this.graph.getModel().getParent(this.cell), cells, evt)) {
                        target = this.graph.getDefaultParent();
                    }
                    // Cloning into locked cells is not allowed
                    clone = clone && !this.graph.isCellLocked(target || this.graph.getDefaultParent());
                    // Passes all selected cells in order to correctly clone or move into
                    // the target cell. The method checks for each cell if its movable.
                    cells = this.graph.moveCells(cells, dx - this.graph.panDx, dy - this.graph.panDy, clone, target, evt);
                    if (this.isSelectEnabled() && this.scrollOnMove) {
                        this.graph.scrollCellToVisible(cells[0]);
                    }
                    // Selects the new cells if cells have been cloned
                    if (clone) {
                        this.graph.setSelectionCells(cells);
                    }
                }
                /**
                 * Function: isRemoveCellsFromParent
                 *
                 * Returns <removeCellsFromParent>.
                 */
                isRemoveCellsFromParent() {
                    return this.removeCellsFromParent;
                }
                /**
                 * Function: setRemoveCellsFromParent
                 *
                 * Sets <removeCellsFromParent>.
                 */
                setRemoveCellsFromParent(value) {
                    this.removeCellsFromParent = value;
                }
                /**
                 * Function: shouldRemoveCellsFromParent
                 *
                 * Returns true if the given cells should be removed from the parent for the specified
                 * mousereleased event.
                 */
                shouldRemoveCellsFromParent(parent, cells, evt) {
                    if (this.graph.getModel().isVertex(parent)) {
                        let pState = this.graph.getView().getState(parent);
                        if (pState != null) {
                            let q = event_1.default.getMainEvent(evt);
                            let pt = utils_1.default.convertPoint(this.graph.container, q.clientX, q.clientY);
                            let alpha = utils_1.default.toRadians(utils_1.default.getValue(pState.style, constants_1.default.STYLE_ROTATION) || 0);
                            if (alpha != 0) {
                                let cos = Math.cos(-alpha);
                                let sin = Math.sin(-alpha);
                                let cx = new point_1.default(pState.getCenterX(), pState.getCenterY());
                                pt = utils_1.default.getRotatedPoint(pt, cos, sin, cx);
                            }
                            return !utils_1.default.contains(pState, pt.x, pt.y);
                        }
                    }
                    return false;
                }
                /**
                 * Function: isSelectEnabled
                 *
                 * Returns <selectEnabled>.
                 */
                isSelectEnabled() {
                    return this.selectEnabled;
                }
                /**
                 * Function: selectDelayed
                 *
                 * Implements the delayed selection for the given mouse event.
                 */
                selectDelayed(me) {
                    if (!this.graph.isCellSelected(this.cell) || !this.graph.popupMenuHandler.isPopupTrigger(me)) {
                        this.graph.selectCellForEvent(this.cell, me);
                    }
                }
                /**
                 * Function: reset
                 *
                 * Resets the state of this handler.
                 */
                reset() {
                    this.destroyShapes();
                    //    this.removeHint();
                    this.delayedSelection = false;
                    //this.guides = null;
                    this.first = null;
                    this.target = null;
                }
                /**
                 * Function: destroyShapes
                 *
                 * Destroy the preview and highlight shapes.
                 */
                destroyShapes() {
                    // Destroys the preview dashed rectangle
                    if (this.shape) {
                        this.shape.destroy();
                        this.shape = null;
                    }
                    if (this.guide) {
                        this.guide.destroy();
                        this.guide = null;
                    }
                    // Destroys the drop target highlight
                    if (this.highlight) {
                        this.highlight.destroy();
                        this.highlight = null;
                    }
                }
            };
            exports_1("default", PxCellDragger);
        }
    };
});
//# sourceMappingURL=cell-dragger.js.map