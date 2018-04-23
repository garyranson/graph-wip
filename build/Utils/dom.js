"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DOM {
    static getNodes(root, whatToShow) {
        const tw = document.createTreeWalker(root, whatToShow);
        const a = [];
        while (tw.nextNode())
            a.push(tw.currentNode);
        return a;
    }
}
exports.default = DOM;
//# sourceMappingURL=dom.js.map