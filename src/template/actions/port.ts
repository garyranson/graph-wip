import {VertexState} from "core/types";

export const PortAction = {
  $type: portFactory,
  $name: 'port',
  $item: 'self',
}

function portFactory() {
  return portAction;
}


function portAction(el: SVGElement, gp: VertexState): void {

  let i=0;
  let  d:Element[];

  const ports = gp && gp.__meta && gp.__meta.ports;
  if(!ports) return;

  for(let e=el.firstElementChild;e;e=e.nextElementSibling,i++) {
    if(i<ports.length) {
      e.setAttribute('cx',<any>(gp.width*<number>ports[i][0]));
      e.setAttribute('cy',<any>(gp.height*<number>ports[i][1]));
    } else {
      if (!d) d = [];
      d.push(e);
    }
  }
  if(d) d.forEach((e) => el.removeChild(e));

  for(;i<ports.length;i++) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    e.setAttribute('cx',<any>(gp.width*ports[i][0]));
    e.setAttribute('cy',<any>(gp.height*ports[i][1]));
    e.setAttribute('class','po-highlight__connector');
    e.setAttribute('pxnode',gp.id);
    e.setAttribute('pxaction','connector');
    e.setAttribute('pxdata',<any>i);
    e.setAttribute('r',<any>5);
    el.appendChild(e);
  }
}
