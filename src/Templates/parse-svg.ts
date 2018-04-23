import DOM from "../Utils/dom";

export default function parseSvg(svg: string) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="__root__">${svg}</svg>`, 'text/html');
  const root = doc.getElementById("__root__");
  root.normalize();
//Remove comments
  DOM.getNodes<Node>(root, NodeFilter.SHOW_COMMENT).forEach(n => n.parentNode.removeChild(n));
  return root;
}
