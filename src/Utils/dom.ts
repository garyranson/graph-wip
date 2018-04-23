export default class DOM {
  public static getNodes<T extends Node>(root: Element, whatToShow: number): T[] {
    const tw = document.createTreeWalker(root, whatToShow);
    const a = [];
    while (tw.nextNode()) a.push(tw.currentNode as T);
    return a;
  }
}
