import {AppBus} from "bus/app-bus";

export const DiagramContextMenuModule = {
  $type: DiagramContextMenu,
  $inject: ['AppBus'],
  $name: 'DiagramContextMenu'
}

function DiagramContextMenu(appBus: AppBus) {
  function contextMenu(e: Event) : void {
    e.preventDefault();
  }

  const init = appBus.diagramInit.add(() => {
    window.addEventListener('contextmenu',contextMenu);
  });

  const destroy = appBus.diagramDestroy.add(() => {
    window.removeEventListener('contextmenu',contextMenu);
    appBus.diagramDestroy.remove(destroy);
    appBus.diagramInit.remove(init);
  });
}
