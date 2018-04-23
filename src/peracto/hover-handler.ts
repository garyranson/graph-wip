import {HoverHandler} from "../types";

export default class HoverHandlerBase implements HoverHandler {
  constructor() {
  }

  canCancel(e: MouseEvent): boolean {
    return true;
  }

  cancel(e: MouseEvent): void {
    console.log(`cancel hover`);
  }
}
