export const ContainerModule = {
  $type: Container,
  $inject: [],
  $name: 'Container'
}

export interface Container {
  get(): Element;

  set(el: string | Element): void;
}

function Container(element: any): Container {
  if (typeof element === 'string')
    element = document.getElementById(element);

  return {
    get(): Element {
      return element;
    },
    set(el: string | Element) {
      if (typeof el === 'string')
        element = document.getElementById(el);
    }
  }
  return element;
}
