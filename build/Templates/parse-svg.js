"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dom_1 = require("../Utils/dom");
function parseSvg(svg) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="__root__">${svg}</svg>`, 'text/html');
    const root = doc.getElementById("__root__");
    root.normalize();
    //Remove comments
    dom_1.default.getNodes(root, NodeFilter.SHOW_COMMENT).forEach(n => n.parentNode.removeChild(n));
    return root;
}
exports.default = parseSvg;
//# sourceMappingURL=parse-svg.js.map