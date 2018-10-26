import {ModelController} from "modules/model-controller";
import {AppBus} from "bus/app-bus";

export const DemoGraphBinderModule = {
  $inject: ['AppBus','ModelController'],
  $name: 'DemoGraphBinder',
  $type: DemoGraphBinder
}
function DemoGraphBinder(appBus: AppBus, model: ModelController): void {
  const self = appBus.diagramInit.add(() => {

    const x = model.createVertex("$container",{x:50,y:50,width:80,height:80},"0");
    model.createVertex("$container",{x:150,y:150,width:80,height:80},"0");

    Array(30).fill(0).map(() => {
      return {
        x: Math.round(Math.random() * 2500),
        y: Math.round(Math.random() * 2200),
        width: 150 + (Math.round(Math.random() * 6) * 8),
        height: 100 + (Math.round(Math.random() * 3) * 8),
        parent: 0
      }
    }).map((e) => model.createVertex("default", e,x.id));


    appBus.diagramInit.remove(self);
  });
}


