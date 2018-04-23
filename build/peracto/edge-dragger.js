System.register(["../util/utils", "./drag-handler", "../util/event", "../util/point", "../util/constants", "../view/connection-constraint", "../handler/cell-highlight"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var utils_1, drag_handler_1, event_1, point_1, constants_1, connection_constraint_1, cell_highlight_1, PxEdgeDragger;
    return {
        setters: [
            function (utils_1_1) {
                utils_1 = utils_1_1;
            },
            function (drag_handler_1_1) {
                drag_handler_1 = drag_handler_1_1;
            },
            function (event_1_1) {
                event_1 = event_1_1;
            },
            function (point_1_1) {
                point_1 = point_1_1;
            },
            function (constants_1_1) {
                constants_1 = constants_1_1;
            },
            function (connection_constraint_1_1) {
                connection_constraint_1 = connection_constraint_1_1;
            },
            function (cell_highlight_1_1) {
                cell_highlight_1 = cell_highlight_1_1;
            }
        ],
        execute: function () {
            /**
             * Class: mxRubberband
             *
             * Event handler that selects rectangular regions. This is not built-into
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
            PxEdgeDragger = class PxEdgeDragger extends drag_handler_1.default {
                //  handler: mxEdgeHandler;
                constructor(graph, data) {
                    super(graph, data);
                    /**
                     * Variable: straightRemoveEnabled
                     *
                     * Specifies if removing bends by creating straight segments should be enabled.
                     * If enabled, this can be overridden by holding down the alt key while moving.
                     * Default is false.
                     */
                    this.straightRemoveEnabled = false;
                    /**
                     * Variable: outlineConnect
                     *
                     * Specifies if connections to the outline of a highlighted target should be
                     * enabled. This will allow to place the connection point along the outline of
                     * the highlighted target. Default is false.
                     */
                    this.outlineConnect = false;
                    this.snapToTerminals = false;
                    /**
                     * Variable: cloneEnabled
                     *
                     * Specifies if cloning by control-drag is enabled. Default is true.
                     */
                    this.cloneEnabled = true;
                    this.index = parseInt(data.data);
                }
                start(e, data) {
                    this.handler = this.graph.selectionCellsHandler.getHandler(this.state.cell);
                    this.bends = this.handler.bends;
                    this.snapPoint = (!this.bends) ? null : this.bends[this.index].bounds.getCenterPt();
                    this.isSource = (!this.bends) ? false : this.index == 0;
                    this.isTarget = (!this.bends) ? false : this.index == this.bends.length - 1;
                    this.shape = this.handler.shape;
                    this.parentHighlight = this.handler.parentHighlight;
                    this.marker = this.handler.marker;
                    this.constraintHandler = this.handler.constraintHandler;
                    this.highlight = new cell_highlight_1.default(this.graph, "cyan", 4);
                }
                cancel() {
                    if (this.highlight) {
                        this.highlight.destroy();
                    }
                }
                targetChange(curr, prev) {
                    //prev - hide overlay
                    //curr - show owerlay
                    /*
                    // We need to:
                    //   * Remove any highlight and adornments from previous cell.
                    //   * Create new highlights and adornments for this cell
                    //   * Determine if we're over a constraint.
                    //   * If we're over a constraint, then we also need to highlight it
                    */
                    if (curr.cell != prev.cell) {
                        this.highlight.highlight(curr.action == 'canvas' ? null : curr.cellState);
                    }
                }
                move(evt) {
                    const constraintHandler = this.constraintHandler;
                    let currentPoint = this.currentPoint = this.getPointForEvent(evt);
                    //const me = new mxMouseEvent(evt,this.currentEvent.cellState);
                    //update(me:mxMouseEvent, source:boolean, existingEdge:mxCell, point:mxPoint) : void {
                    // Source is true when :
                    const shape = this.marker.highlight.shape;
                    const isSource = shape ? utils_1.default.isAncestorNode(shape.node, (evt.srcElement || evt.target)) : false;
                    constraintHandler.update2(evt, this.isSource, this.state.cell, isSource ? null : this.currentPoint, this.currentEvent.cellState);
                    this.error = null;
                    //console.log(`dragmove${evt.clientX}:${evt.clientY}:evtpt:${currentPoint.x}:${currentPoint.y}`);
                    const marker = this.marker;
                    // Uses the current point from the constraint handler if available
                    // constrains the cursor to the snapPoint axis
                    if (!this.graph.isIgnoreTerminalEvent(evt) && evt.shiftKey && this.snapPoint) {
                        if (Math.abs(this.snapPoint.x - currentPoint.x) < Math.abs(this.snapPoint.y - currentPoint.y)) {
                            currentPoint.x = this.snapPoint.x;
                        }
                        else {
                            currentPoint.y = this.snapPoint.y;
                        }
                    }
                    this.handler.points = this.getPreviewPoints(currentPoint, evt.altKey);
                    let terminalState = this.state; //this.getPreviewTerminalState();
                    // If cursor is over a contraint, then use the contraint's location as the terminal currentPoint
                    /*
                        if (constraintHandler.currentConstraint && constraintHandler.currentFocus && constraintHandler.currentPoint) {
                          currentPoint = this.currentPoint = constraintHandler.currentPoint.clone();
                        }
                        else if (this.outlineConnect) {
                          // Need to check outline before cloning terminal state
                          let outline = (this.isSource || this.isTarget) ? this.isOutlineConnectEvent(evt) : false
                    
                          if (outline) {
                            terminalState = marker.highlight.state;
                          }
                          else if (terminalState != null && terminalState != this.getState() && marker.highlight.shape != null) {
                            marker.highlight.shape.stroke = 'transparent';
                            marker.highlight.repaint();
                            terminalState = null;
                          }
                        }
                    */
                    let clone = this.clonePreviewState(currentPoint, terminalState ? terminalState.cell : null);
                    this.updatePreviewState(clone, currentPoint, terminalState, evt /*, outline*/); //TODO: Where did outline come from?
                    // Sets the color of the preview to valid or invalid, updates the
                    // points of the preview and redraws
                    let color = (this.error == null) ? marker.validColor : marker.invalidColor;
                    this.setPreviewColor(color);
                    this.handler.abspoints = clone.absolutePoints;
                    this.handler.active = true;
                    this.drawPreview();
                }
                /**
                 * Function: drawPreview
                 *
                 * Redraws the preview.
                 */
                drawPreview() {
                    this.shape.apply(this.state);
                    this.shape.points = this.handler.abspoints;
                    this.shape.isDashed = this.handler.isSelectionDashed();
                    this.shape.stroke = 'cyan'; //this.handler.getSelectionColor();
                    this.shape.strokewidth = this.handler.getSelectionStrokeWidth();
                    this.shape.isShadow = false;
                    this.shape.redraw();
                    if (this.parentHighlight) {
                        this.parentHighlight.redraw();
                    }
                }
                /**
                 * Function: setPreviewColor
                 *
                 * Sets the color of the preview to the given value.
                 */
                setPreviewColor(color) {
                    if (this.shape) {
                        this.shape.stroke = color;
                    }
                }
                /**
                 * Function: updatePreviewState
                 *
                 * Updates the given preview state taking into account the state of the constraint handler.
                 */
                updatePreviewState(edge, point, dragState, me, outline) {
                    const marker = this.marker;
                    const constraintHandler = this.constraintHandler;
                    const isSource = this.isSource;
                    const isTarget = this.isTarget;
                    // Computes the points for the edge style and terminals
                    let sourceState = (isSource) ? dragState : this.state.getVisibleTerminalState(true);
                    let targetState = (isTarget) ? dragState : this.state.getVisibleTerminalState(false);
                    let sourceConstraint = this.graph.getSourceConnectionConstraint(edge, sourceState);
                    let targetConstraint = this.graph.getTargetConnectionConstraint(edge, targetState);
                    let constraint = constraintHandler.currentConstraint;
                    /*if (!constraint && outline) {
                      if (!dragState) {
                        // Handles special case where mouse is on outline away from actual end point
                        // in which case the grid is ignored and mouse point is used instead
                        if (this.isSourceShape(marker.highlight.shape, me)) {
                          point = new mxPoint(me.clientX, me.clientY);
                        }
                
                        constraint = this.graph.getOutlineConstraint(point, dragState);
                        constraintHandler.setFocus(me, dragState, isSource);
                        constraintHandler.currentConstraint = constraint;
                        constraintHandler.currentPoint = point;
                      }
                      else {
                        constraint = new mxConnectionConstraint();
                      }
                    }*/
                    if (isSource) {
                        sourceConstraint = constraint;
                    }
                    else {
                        targetConstraint = constraint;
                    }
                    const style = edge.style;
                    const view = edge.view;
                    const keyX = isSource ? constants_1.default.STYLE_EXIT_X : constants_1.default.STYLE_ENTRY_X;
                    const keyY = isSource ? constants_1.default.STYLE_EXIT_Y : constants_1.default.STYLE_ENTRY_Y;
                    if (constraint && constraint.point) {
                        style[keyX] = constraint.point.x;
                        style[keyY] = constraint.point.y;
                    }
                    else {
                        delete style[keyX];
                        delete style[keyY];
                    }
                    edge.setVisibleTerminalState(sourceState, true);
                    edge.setVisibleTerminalState(targetState, false);
                    if (!isSource || sourceState) {
                        view.updateFixedSourceTerminalPoint(edge, sourceState, sourceConstraint);
                    }
                    if (!isTarget || targetState) {
                        view.updateFixedTargetTerminalPoint(edge, targetState, targetConstraint);
                    }
                    edge.setAbsoluteTerminalPoint(point, this.isSource);
                    if (marker.getMarkedState() == null) {
                        this.error = (this.graph.allowDanglingEdges) ? null : '';
                    }
                    view.updatePoints(edge, this.handler.points, sourceState, targetState);
                    view.updateFloatingTerminalPoints(edge, sourceState, targetState);
                }
                // noinspection JSUnusedLocalSymbols
                /**
                 * Function: clonePreviewState
                 *
                 * Returns a clone of the current preview state for the given point and terminal.
                 */
                clonePreviewState(point, terminal) {
                    return this.state.clone();
                }
                /**
                 * Function: isOutlineConnectEvent
                 *
                 * Returns true if <outlineConnect> is true and the source of the event is the outline shape
                 * or shift is pressed.
                 */
                isOutlineConnectEvent(me) {
                    let offset = utils_1.default.getOffset(this.graph.container);
                    let clientX = me.clientX;
                    let clientY = me.clientY;
                    let doc = document.documentElement;
                    let left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
                    let top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
                    let gridX = this.currentPoint.x - this.graph.container.scrollLeft + offset.x - left;
                    let gridY = this.currentPoint.y - this.graph.container.scrollTop + offset.y - top;
                    const marker = this.marker;
                    return this.outlineConnect
                        && !me.shiftKey
                        && (this.isSourceShape(marker.highlight.shape, me) ||
                            (me.altKey && this.getState() != null) ||
                            marker.highlight.isHighlightAt(clientX, clientY) ||
                            ((gridX != clientX || gridY != clientY)
                                && this.getState() == null
                                && marker.highlight.isHighlightAt(gridX, gridY)));
                }
                /**
                 * Function: validateConnection
                 *
                 * Returns the error message or an empty string if the connection for the
                 * given source, target pair is not valid. Otherwise it returns null. This
                 * implementation uses <mxGraph.getEdgeValidationError>.
                 *
                 * Parameters:
                 *
                 * source - <mxCell> that represents the source terminal.
                 * target - <mxCell> that represents the target terminal.
                 */
                validateConnection(source, target) {
                    return this.graph.getEdgeValidationError(this.state.cell, source, target);
                }
                isSourceShape(shape, evt) {
                    return shape
                        ? utils_1.default.isAncestorNode(shape.node, (evt.srcElement || evt.target)) :
                        false;
                }
                /**
                 * Function: getPreviewTerminalState
                 *
                 * Updates the given preview state taking into account the state of the constraint handler.
                 */
                getPreviewTerminalState(me) {
                    const marker = this.marker;
                    const constraintHandler = this.constraintHandler;
                    //  constraintHandler.update(me, this.isSource, true, this.isSourceShape(marker.highlight.shape, me) ? null : this.currentPoint);
                    if (constraintHandler.currentFocus != null && constraintHandler.currentConstraint != null) {
                        // Handles special case where grid is large and connection point is at actual point in which
                        // case the outline is not followed as long as we're < gridSize / 2 away from that point
                        if (marker.highlight && marker.highlight.state &&
                            marker.highlight.state.cell == constraintHandler.currentFocus.cell) {
                            // Direct repaint needed if cell already highlighted
                            if (marker.highlight.shape.stroke != 'transparent') {
                                marker.highlight.shape.stroke = 'transparent';
                                marker.highlight.repaint();
                            }
                        }
                        else {
                            marker.markCell(constraintHandler.currentFocus.cell, 'transparent');
                        }
                        let model = this.graph.getModel();
                        let other = this.graph.view.getTerminalPort(this.state, this.graph.view.getState(this.isSource
                            ? model.getTargetTerminal(this.state.cell)
                            : model.getSourceTerminal(this.state.cell) //model.getTerminal(this.state.cell, !this.isSource)
                        ), !this.isSource);
                        let otherCell = (other != null) ? other.cell : null;
                        let source = (this.isSource) ? constraintHandler.currentFocus.cell : otherCell;
                        let target = (this.isSource) ? otherCell : constraintHandler.currentFocus.cell;
                        // Updates the error message of the handler
                        this.error = this.validateConnection(source, target);
                        let result = null;
                        if (this.error == null) {
                            result = constraintHandler.currentFocus;
                        }
                        else {
                            constraintHandler.reset();
                        }
                        return result;
                    }
                    else if (!this.graph.isIgnoreTerminalEvent(me)) {
                        return marker.setCurrentStateX(this.getState(), me);
                    }
                    else {
                        marker.reset();
                        return null;
                    }
                }
                /**
                 * Function: convertPoint
                 *
                 * Converts the given point in-place from screen to unscaled, untranslated
                 * graph coordinates and applies the grid. Returns the given, modified
                 * point instance.
                 *
                 * Parameters:
                 *
                 * point - <mxPoint> to be converted.
                 * gridEnabled - Boolean that specifies if the grid should be applied.
                 */
                convertPoint(point, gridEnabled) {
                    let tr = this.graph.view.getTranslate();
                    if (gridEnabled) {
                        point.x = this.graph.snap(point.x);
                        point.y = this.graph.snap(point.y);
                    }
                    point.x = Math.round(point.x - tr.x);
                    point.y = Math.round(point.y - tr.y);
                    let pstate = this.graph.view.getState(this.graph.model.getParent(this.state.cell));
                    if (pstate) {
                        point.x -= pstate.origin.x;
                        point.y -= pstate.origin.y;
                    }
                    return point;
                }
                /**
                 * Function: getPreviewPoints
                 *
                 * Updates the given preview state taking into account the state of the constraint handler.
                 *
                 * Parameters:
                 *
                 * pt - <mxPoint> that contains the current pointer position.
                 * me - Optional <mxMouseEvent> that contains the current event.
                 */
                getPreviewPoints(pt, altKey) {
                    let geometry = this.graph.getCellGeometry(this.state.cell);
                    let points = geometry.points ? geometry.points.slice() : null;
                    return this.graph.resetEdgesOnConnect
                        ? null
                        : points;
                }
                getSnapToTerminalTolerance() {
                    return (this.graph.gridSize / 2); //this.getSnapToTerminalTolerance();
                }
                /**
                 * Function: isSnapToTerminalsEvent
                 *
                 * Returns true if <snapToTerminals> is true and if alt is not pressed.
                 */
                isSnapToTerminalsEvent(me) {
                    return this.snapToTerminals && !event_1.default.isAltDown(me);
                }
                getPointForEvent(me) {
                    let view = this.graph.getView();
                    let point = new point_1.default(Math.round(me.clientX), Math.round(me.clientY));
                    let tt = this.getSnapToTerminalTolerance();
                    let overrideX = false;
                    let overrideY = false;
                    if (tt > 0 && this.isSnapToTerminalsEvent(me)) {
                        let snapToPoint = (pt) => {
                            if (pt != null) {
                                let x = pt.x;
                                if (Math.abs(point.x - x) < tt) {
                                    point.x = x;
                                    overrideX = true;
                                }
                                let y = pt.y;
                                if (Math.abs(point.y - y) < tt) {
                                    point.y = y;
                                    overrideY = true;
                                }
                            }
                        };
                        // Temporary function
                        let snapToTerminal = (terminal) => {
                            if (terminal != null) {
                                snapToPoint.call(this, new point_1.default(view.getRoutingCenterX(terminal), view.getRoutingCenterY(terminal)));
                            }
                        };
                        snapToTerminal(this.state.getVisibleTerminalState(true));
                        snapToTerminal(this.state.getVisibleTerminalState(false));
                        if (this.state.absolutePoints != null) {
                            for (let i = 0; i < this.state.absolutePoints.length; i++) {
                                snapToPoint(this.state.absolutePoints[i]);
                            }
                        }
                    }
                    if (this.graph.isGridEnabledEvent(me)) {
                        let tr = view.translate;
                        if (!overrideX) {
                            point.x = (this.graph.snap(point.x - tr.x) + tr.x);
                        }
                        if (!overrideY) {
                            point.y = (this.graph.snap(point.y - tr.y) + tr.y);
                        }
                    }
                    return point;
                }
                drop(evt) {
                    //console.log(`drop:${e.clientX}:${e.clientY}`);
                    const data = this.currentEvent;
                    if (!data.cell)
                        return;
                    const dropTarget = data.cell;
                    if (!dropTarget.isVertex()) {
                        return;
                    }
                    let dragEdge = this.state.cell;
                    const graph = this.graph;
                    const model = graph.model;
                    let clone = !graph.isIgnoreTerminalEvent(evt) && graph.isCloneEvent(evt) /* Control key pressed */ && this.cloneEnabled && graph.isCellsCloneable();
                    let parentCell = model.getParent(dragEdge);
                    if (clone) {
                        const clonedEdge = graph.cloneCells([dragEdge])[0];
                        const geo = model.getGeometryClone(dragEdge);
                        if (geo) {
                            model.setGeometry(clonedEdge, geo);
                        }
                        model.add(parentCell, clonedEdge, model.getChildCount(parentCell));
                        if (this.isSource) {
                            graph.connectTargetCell(clonedEdge, model.getTargetTerminal(dragEdge));
                        }
                        else {
                            graph.connectSourceCell(clonedEdge, model.getSourceTerminal(dragEdge));
                        }
                        dragEdge = clonedEdge;
                    }
                    else {
                        if (this.isSource) {
                            graph.connectSourceCell(dragEdge, dropTarget);
                        }
                        else {
                            graph.connectTargetCell(dragEdge, dropTarget);
                        }
                    }
                    /*
                        if (this.graph.isAllowDanglingEdges()) {
                          let pt = this.handler.abspoints[(this.isSource) ? 0 : this.handler.abspoints.length - 1];
                          pt.x = this.roundLength(pt.x - this.graph.view.translate.x);
                          pt.y = this.roundLength(pt.y - this.graph.view.translate.y);
                
                          let pstate = graph.view.getState(graph.getModel().getParent(dragEdge));
                
                          if (pstate) {
                            pt.x -= pstate.origin.x;
                            pt.y -= pstate.origin.y;
                          }
                
                          pt.x -= this.graph.panDx;
                          pt.y -= this.graph.panDy;
                
                          // Destroys and recreates this handler
                          dragEdge = this.changeTerminalPoint(dragEdge, pt, this.isSource, clone);
                        }
                    */
                    // Resets the preview color the state of the handler if this
                    // handler has not been recreated
                    if (this.handler.marker) {
                        this.handler.reset();
                        // Updates the selection if the edge has been cloned
                        if (dragEdge != this.state.cell) {
                            this.graph.setSelectionCell(dragEdge);
                        }
                    }
                }
                changeTerminalPoint(edge, point, isSource, clone) {
                    let model = this.graph.model;
                    model.beginUpdate();
                    try {
                        if (clone) {
                            let parent = model.getParent(edge);
                            let terminal = isSource ? model.getTargetTerminal(edge) : model.getSourceTerminal(edge); //model.getTerminal(edge, !isSource);
                            edge = this.graph.cloneCells([edge])[0];
                            model.add(parent, edge, model.getChildCount(parent));
                            if (isSource)
                                model.setTargetTerminal(edge, terminal);
                            else
                                model.setSourceTerminal(edge, terminal);
                            //model.setTerminal(edge, terminal, !isSource);
                        }
                        let geo = model.getGeometry(edge);
                        if (geo) {
                            geo = geo.clone();
                            geo.setTerminalPoint(point, isSource);
                            model.setGeometry(edge, geo);
                            this.graph.connectCell(edge, null, isSource, new connection_constraint_1.default());
                        }
                    }
                    finally {
                        model.endUpdate();
                    }
                    return edge;
                }
                /**
                 * Function: changePoints
                 *
                 * Changes the control points of the given edge in the graph model.
                 */
                changePoints(edge, points, clone) {
                    let model = this.graph.getModel();
                    model.beginUpdate();
                    try {
                        if (clone) {
                            let parent = model.getParent(edge);
                            let source = model.getSourceTerminal(edge);
                            let target = model.getTargetTerminal(edge);
                            edge = this.graph.cloneCells([edge])[0];
                            model.add(parent, edge, model.getChildCount(parent));
                            model.setSourceTerminal(edge, source);
                            model.setTargetTerminal(edge, target);
                        }
                        let geo = model.getGeometry(edge);
                        if (geo != null) {
                            geo = geo.clone();
                            geo.points = points;
                            model.setGeometry(edge, geo);
                        }
                    }
                    finally {
                        model.endUpdate();
                    }
                    return edge;
                }
            };
            exports_1("default", PxEdgeDragger);
        }
    };
});
//# sourceMappingURL=edge-dragger.js.map