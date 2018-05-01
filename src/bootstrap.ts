///<reference path="peracto/gesture-handler.ts"/>
import DomGestureHandler from "./peracto/dom-gesture-handler";
import GestureHandler from "./peracto/gesture-handler";
import {GpNode} from "./types";
import GpGraphImpl from "./Shadow/graph";
import GpGraphViewImpl from "./Shadow/graph-view";
import NodeHighlighter from "./peracto/node-highlighter";

export default function (container: Element): void {

  const doc = GpGraphImpl.create();
  const view = new GpGraphViewImpl(container as SVGSVGElement);

  doc.bindView(view);

  const highlighter = new NodeHighlighter(view);
  const handler = new GestureHandler(view);
  handler.onOver.add(highlighter.action.bind(highlighter));

  DomGestureHandler(container, handler);

  // const rootNode = doc.createContainerObject("rootNode", 0, 0, 3000, 1000);
  const root = doc.getRoot();
  const objset: GpNode[] = [];

  for (let i = 0; i < 10; i++) {
    const x = Math.round(Math.random() * 1500);
    const y = Math.round(Math.random() * 1200);
    const r = Math.round(Math.random() * 5) * 10;
    const q = Math.round(Math.random() * 5) * 10;
    const box1 = doc.createObject("default", x, y, 150 + r, 100 + q);
    root.appendChild(box1);
    objset.push(box1);
  }

  let s = 10;
  setInterval(() => {
    //const s = 1 + Math.round(Math.random() * 3);
    s = ((s + 1) % 25);
    s = 10;
    for (const o of objset) {
      const x = Math.random() * 2500;
      const y = Math.random() * 1200;
      highlighter.action(null);
      o.setLocation(x, y);
      o.setSize((s * 8) + 20, (s * 8) + 20);
    }
  }, 300000);
}

