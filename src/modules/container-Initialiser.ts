export const ContainerModule = {
  $type: Container,
  $inject: [],
  $name: 'Container'
}
function Container(element: any): Element {
  if(typeof element==='string')
    return document.getElementById(element);
  return element;
}
