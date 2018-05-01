import {NodeAction} from "../types";
import MoverNodeAction from "./mover-node-action";
import ResizerNodeAction from "./resizer-node-action";
import CanvasNodeAction from "./canvas-node-action";

const nodeActionLibrary = new Map<string,NodeAction>([
  ["mover",new MoverNodeAction()],
  ["canvas",new CanvasNodeAction()],
  ["resizer",new ResizerNodeAction()]
]);

export default nodeActionLibrary;

