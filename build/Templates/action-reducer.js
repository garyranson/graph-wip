"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function r0(el, gp) {
}
function r2(x1, x2) {
    return function (el, gp) {
        x1(el, gp);
        x2(el, gp);
    };
}
function r3(x1, x2, x3) {
    return function (el, gp) {
        x1(el, gp);
        x2(el, gp);
        x3(el, gp);
    };
}
function r4(x1, x2, x3, x4) {
    return function (el, gp) {
        x1(el, gp);
        x2(el, gp);
        x3(el, gp);
        x4(el, gp);
    };
}
function r5(x1, x2, x3, x4, x5) {
    return function (el, gp) {
        x1(el, gp);
        x2(el, gp);
        x3(el, gp);
        x4(el, gp);
        x5(el, gp);
    };
}
function rN(values) {
    return function (el, gp) {
        for (const x of values) {
            x(el, gp);
        }
    };
}
function actionReducer(values) {
    switch (values.length) {
        case 0:
            return r0;
        case 1:
            return values[0];
        case 2:
            return r2(values[0], values[1]);
        case 3:
            return r3(values[0], values[1], values[2]);
        case 4:
            return r4(values[0], values[1], values[2], values[3]);
        case 5:
            return r5(values[0], values[1], values[2], values[3], values[4]);
        default:
            return rN(values);
    }
}
exports.default = actionReducer;
//# sourceMappingURL=action-reducer.js.map