import {loader} from "core/loaders";
import {defineModule, Injector} from "core/injector";
import {DemoTemplatesModule} from "../demo-templates";

const coreApps = {
  "demo": {
    core: 'loader/demo-diagram-core',
    instance: 'loader/demo-diagram-instance',
    html: "src/templates.html",
  }
}

const coreComponentCache = new Map<string, Promise<Injector>>();
const graphFactoryCache = new Map<string, Promise<(...args) => Injector>>();

export function getGraphFactory(name: string) : Promise<(...args) => Injector> {
  let a = graphFactoryCache.get(name);
  if (!a) {
    a = _getGraph(name);
    graphFactoryCache.set(name, a);
  }
  return a;
}

function _getGraph(name: string) : Promise<(...args) => Injector> {
  const app = coreApps[name];
  if (!app) throw new Error(`don't know how to show ${name}`);

  return Promise.all([
    getCoreComponents(app.html, app.core),
    import(app.instance).then((core: any) => core.instance as InstInjector)
  ]).then(([coreInjector, instance]) => {
    const factory = (...args) => {
      return instance.apply(null, [coreInjector, ...args])
    };
    graphFactoryCache.set(name,Promise.resolve(factory));
    return factory;
  });
}

function getCoreComponents(html: string, core: string): Promise<Injector> {
  let a = coreComponentCache.get(html);
  if(!a) {
    a = _loadCoreComponents(html, core);
    coreComponentCache.set(html,a);
  }
  return a;
}

function _loadCoreComponents(html: string, core: string) : Promise<Injector> {
  return Promise.all([
    loader.html(html),
    import(core),
  ]).then(([doc, core]) => {
    return core.core(
      defineModule(DemoTemplatesModule, Array.from(doc.querySelectorAll('widget[id]')))
    );
  });
}

interface InstInjector {
  (i: Injector, args:[]): Injector
}
