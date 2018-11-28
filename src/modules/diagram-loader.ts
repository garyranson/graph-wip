import {loader} from "core/loaders";
import {AppBus} from "bus/app-bus";
import {Container} from "template/container-initialiser";
import {defineModule, Injector} from "core/injector";
import {DemoTemplatesModule} from "../demo-templates";

export function loadDiagram(name: string): Promise<DiagramLoader> {
  return loader
    .json(name)
    .then(createInstance)
}

const coreApps = {
  "demo": {
    core: 'loader/demo-diagram-core',
    inst: 'loader/demo-diagram-instance',
    html: "src/templates.html",
  }
}

const iCache = new Map<string, DiagramInitFunction>();

function createInstance(xdoc: any): Promise<DiagramLoader> {
  const a = iCache.get(xdoc.type);
  if (a) return Promise.resolve({doc: xdoc, init: a});
  const app = coreApps[xdoc.type];
  if (!app) throw new Error(`don't know how to show ${xdoc.type}`);
  return Promise.all([
    load(app.html, app.core),
    import(app.inst).then((core: any) => core.instance as InstInjector)
  ]).then(([c, inst]) => {
    return {
      doc: xdoc,
      init: (container) => {
        const app = inst(c, container);
        const bus = app.get<AppBus>('AppBus');
        bus.diagramInit.fire({container: app.get<Container>('Container').get()});
        return app;
      }
    }
  });
}

const cache = new Map<string, Promise<Injector>>();

function load(html: string, core: string): Promise<Injector> {

  return cache.get(html) || cacheit(html, Promise.all([
      loader.html(html),
      import(core),
    ]).then(([doc, core]) => {
      return core.core(
        defineModule(DemoTemplatesModule, Array.from(doc.querySelectorAll('widget[id]')))
      );
    })
  );
}

function cacheit(key: string, p: Promise<Injector>): Promise<Injector> {
  cache.set(key, p);
  return p;
}

interface InstInjector {
  (i: Injector, v: string | Element): Injector
}



interface DiagramInitFunction {
  (el: string | Element): Injector
}

export interface DiagramLoader {
  doc: any;
  init: DiagramInitFunction;
}
