"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const expression_compiler_1 = require("expression-compiler");
function widthFactory(o) {
    const offset = o.key || 0;
    return (el, gp) => {
        el.setAttribute("width", (gp.width + offset));
    };
}
function borderFactory(o) {
    const offset = o.key || 0;
    return (el, gp) => {
        el.setAttribute("x", (-offset));
        el.setAttribute("y", (-offset));
        el.setAttribute("width", (gp.width + offset + offset));
        el.setAttribute("height", (gp.height + offset + offset));
    };
}
function sizeFactory(o) {
    const wOffset = o.values[0] || 0;
    const hOffset = o.values[1] || wOffset;
    return (el, gp) => {
        el.setAttribute("width", (gp.width + wOffset));
        el.setAttribute("height", (gp.height + hOffset));
    };
}
function heightFactory(o) {
    const offset = o.key;
    return (el, gp) => {
        el.setAttribute("height", (gp.height + offset));
    };
}
function positionFactory(o) {
    return (el, gp) => {
        el.setAttribute("transform", `translate(${gp.x},${gp.y})`);
    };
}
function textFactory(o) {
    return (el, gp) => {
        el.textContent = gp.getId().toString();
    };
}
function boundsFactory(o) {
    return (el, gp) => {
        el.setAttribute("height", (gp.height));
        el.setAttribute("width", (gp.width));
        el.setAttribute("x", (gp.x));
        el.setAttribute("y", (gp.y));
    };
}
function bindCache(factory, build) {
    let cache;
    return function (value) {
        const o = build(value);
        if (!cache) {
            cache = new Map();
        }
        let rc = cache.get(o.key);
        if (!rc) {
            rc = factory(o);
            cache.set(o.key, rc);
        }
        return rc;
    };
}
function bindSingleton(factory) {
    let cache;
    return function (value) {
        return cache || (cache = factory(null));
    };
}
function simpleParse(s) {
    return { key: parseInt(s) || 0 };
}
function twoParse(s) {
    const x = s.split(/\s+/).map((s) => parseFloat(s));
    return {
        key: s,
        v1: x[0],
        v2: x[1]
    };
}
function splitParse(s) {
    const x = s.split(/\s+/).map((s) => parseFloat(s));
    return {
        key: x.join(','),
        values: x,
    };
}
function xRatioFactory(o) {
    const ratio = o.v1;
    const offset = o.v2 || 0;
    return (el, gp) => {
        el.setAttribute("x", ((gp.width * ratio) + offset));
    };
}
function yRatioFactory(o) {
    const ratio = o.v1;
    const offset = o.v2 || 0;
    return (el, gp) => {
        el.setAttribute("y", ((gp.height * ratio) + offset));
    };
}
function xyRatioFactory(o) {
    const xratio = o.values[0] || 0;
    const yratio = o.values[1] || 0;
    const xoffset = o.values[2] || 0;
    const yoffset = o.values[3] || 0;
    console.log('creating:', o.values);
    return (el, gp) => {
        el.setAttribute("x", ((gp.width * xratio) + xoffset));
        el.setAttribute("y", ((gp.height * yratio) + yoffset));
    };
}
const bindMap = {
    'data-text-bind': bindSingleton(textFactory),
    'data-text-eval': bindCache(textExprFactory, expressionParse),
    'data-position-bind': bindSingleton(positionFactory),
    'data-bounds-bind': bindSingleton(boundsFactory),
    'data-height-bind': bindCache(heightFactory, simpleParse),
    'data-border-bind': bindCache(borderFactory, simpleParse),
    'data-width-bind': bindCache(widthFactory, simpleParse),
    'data-size-bind': bindCache(sizeFactory, splitParse),
    'data-x-ratio': bindCache(xRatioFactory, twoParse),
    'data-y-ratio': bindCache(yRatioFactory, twoParse),
    'data-xy-ratio': bindCache(xyRatioFactory, splitParse),
};
function findAction(name) {
    return bindMap[name];
}
exports.findAction = findAction;
function expressionParse(expr) {
    const compiler = new expression_compiler_1.Compiler();
    const r = compiler.compile(expr);
    return {
        key: expr,
        expr: r.toFunction()
    };
}
function textExprFactory(o) {
    const expr = o.expr;
    return (el, gp) => {
        el.textContent = expr(gp);
    };
}
//# sourceMappingURL=actions.js.map