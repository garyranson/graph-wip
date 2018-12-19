import {loader} from "core/loaders";
import {ModelLoader} from "modules/model-loader";
import {Container} from "template/container-initialiser";
import {getGraphFactory} from "core/diagram-loader";
import {AppBus} from "bus/app-bus";

export function bootstrap(container: Element | string): void {
  loader.json<any>('src/demo-model.json').then((doc) => {
    getGraphFactory(doc.type).then((factory) => {
      const app = factory(container);
      const bus = app.get<AppBus>('AppBus');
      bus.diagramInit.fire({container: app.get<Container>('Container').get()});
      app.get<ModelLoader>('ModelLoader').load(doc);
    });
  });
}


/*

function test1(q) {

  let x = q+1;
  let y = q+2;

  function xx() {
    return x*y;
  }

  return xx();
}

function test2(q) {

  let x = q+1;
  let y = q+2;

  return xx(x,y);
}

function test3(q) {

  let x = q+1;
  let y = q+2;

  return x*y;
}

function test4(q) {

  let x = q+1;
  let y = q+2;

  return yy({x,y});
}



function xx(x,y) {
  return x*y;
}
function yy(x) {
  return x.x*x.y;
}


function tester(q) {

  console.time('test1');
  let a1 = 0;
  for(let i=0;i<q;i++) {
    a1+=test1(i);
  }
  console.timeEnd('test1');

  console.time('test2');
  let a2 = 0;
  for(let i=0;i<q;i++) {
    a2+=test2(i);
  }
  console.timeEnd('test2');

  console.time('test3');
  let a3 = 0;
  for(let i=0;i<q;i++) {
    a3+=test3(i);
  }
  console.timeEnd('test3');

  console.time('test4');
  let a4 = 0;
  for(let i=0;i<q;i++) {
    a4+=test4(i);
  }
  console.timeEnd('test4');

  console.log(a1,a2,a3,a4);
}
*/
