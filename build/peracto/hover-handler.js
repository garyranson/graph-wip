"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HoverHandlerBase {
    constructor() {
    }
    canCancel(e) {
        return true;
    }
    cancel(e) {
        console.log(`cancel hover`);
    }
}
exports.default = HoverHandlerBase;
//# sourceMappingURL=hover-handler.js.map