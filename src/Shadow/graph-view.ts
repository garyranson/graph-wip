import TemplateLibrary from "../Templates/template-library";
import {GpGraphView, GpNode, GpNodeView, GpParentNode} from "../types";

export default class GpGraphViewImpl implements GpGraphView  {
  map: Map<number, GpNodeView> = new Map<number, GpNodeView>();
  container: SVGSVGElement;

  trigger = Trigger(() => {
    this.delete.fire();
    this.create.fire();
    this.resize.fire();
    this.move.fire();
  });

  constructor(svg: SVGSVGElement) {
    this.container = svg;
  }

  appendNodeView(view: GpNodeView): void {
    if(!view) return;
    this.container.appendChild(view.getRoot());
  }


  getContainer() : Element {
    return this.container;
  }

  buildTree(node: GpNode) : GpNodeView {
    //Check if we already have the instance
    let instance = this.map.get(node.getId());
    if (!instance) {
      instance = TemplateLibrary.createView(node);
      this.map.set(node.getId(), instance);

      if (node.hasChildren()) {
        for (const child of node.getChildren()) {
          instance.appendChild(this.buildTree(child));
        }
      }
    }
    return instance;
  }

  resize = Dooer(this.trigger, (o) => {
    const e = this.map.get(o.getId());
    if (!e) return;
    e.refresh();
  });
  create = Dooer(this.trigger, (context) => {
    if (this.map.get(context.getId())) return;

    let px = context.getParent();
    while(px && !this.map.get(px.getId())) {
      context = px;
      px = px.getParent();
    }
    const instance = this.buildTree(context);
    const parent = context.getParent();
    this.map.get(parent.getId()).appendChild(instance);
  });
  delete = Dooer(this.trigger, (o) => {
    const e = this.map.get(o.getId());
    if (e) {
      e.remove();
      this.map.delete(o.getId());
    }
  });
  move = Dooer(this.trigger, (o) => {
    const e = this.map.get(o.getId());
    if (!e) return;
    e.refresh();
  });
  id: number;

  initialize(layers: GpParentNode[]) {
    layers
      .map((layer) => this.buildTree(layer))
      .forEach(i => this.container.appendChild(i.getRoot()));
  }

  getInstance(id: number) : GpNodeView {
    return this.map.get(id);
  }

  triggerResize(obj: GpNode) {
    this.resize.add(obj);
  }

  triggerCreate(obj: GpNode) {
    this.create.add(obj);
  }

  triggerMove(obj: GpNode) {
    this.move.add(obj);
  }

  triggerDelete(obj: GpNode) {
    this.delete.add(obj);
  }

}

interface IDooer {
  add(o: GpNode) : void;
  fire() : void;
}

function Dooer(setter: ()=>void,action: (o:GpNode) => void) : IDooer {
  let set : Set<GpNode>;

  return {
    add,
    fire
  };

  function add(o: GpNode) : void {
    if(!set) {
      set = new Set<GpNode>();
      setter();
    }
    set.add(o);
  }

  function fire() : void {
    if(set) {
      set.forEach(action);
      set = null;
    }
  }
}

function Trigger(action : () => void) {
  let trigger = 0;

  return () => {
    if(trigger==0) {
      trigger = window.requestAnimationFrame(fire);
    }
  };

  function fire() {
    action();
    trigger = 0;
  }
}


window.addEventListener('resize', resize);

function resize() {
  console.log('resize');
}
