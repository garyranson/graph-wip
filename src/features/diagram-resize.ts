import {AppBus} from "bus/app-bus";

export const DiagramResizeModule = {
  $type: diagramResize,
  $inject: ['AppBus'],
}

function diagramResize(appBus: AppBus) {

  function resize() : void {
    appBus.diagramResize.fire(null);
  }

  const init = appBus.diagramInit.add(() => {
    window.addEventListener('resize', resize);
  });

  const destroy = appBus.diagramDestroy.add(() => {
    window.removeEventListener('resize',resize);
    appBus.diagramDestroy.remove(destroy);
    appBus.diagramInit.remove(init);
  });
}

diagramResize.$inject = ['AppBus'];
