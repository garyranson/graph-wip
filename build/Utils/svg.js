"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createSvgElement(tagName, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tagName);
    if (attrs) {
        for (const key in attrs) {
            if (key == 'href') {
                el.setAttributeNS("http://www.w3.org/1999/xlink", key, attrs[key]);
            }
            else {
                el.setAttribute(key, attrs[key]);
            }
        }
    }
    return el;
}
exports.createSvgElement = createSvgElement;
//# sourceMappingURL=svg.js.map