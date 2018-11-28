export const ContainerModule = {
  $type: Container,
  $inject: [],
  $name: 'Container'
}

export interface Container {
  get(): Element;

  setCursor(value: string): void;
}

function Container(element: string|Element): Container {

  const el = (typeof element === 'string')
    ? document.getElementById(element)
    : element;

  const body = el.ownerDocument.body;

  let cursor: string;

  return {
    get(): Element {
      return el;
    },
    setCursor(value: string) {
      if (value !== cursor) {
        if (cursor) body.classList.remove(cursor);
        cursor = value;
        if (cursor) body.classList.add(cursor);
      }
    }
  }
}

