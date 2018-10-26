export interface Module {
  $type: Function,
  $name?: string,
  $params?: any[],
  $inject?: any[],
  $item?: string,
  $payload?: any
}

export function defineModule(type: Module, ...args): Module {
  return {...type, $params: args};
}

export interface Injector {
  define(...modules: Module[]): Injector;

  init(...modules: Module[]): Injector;

  get<T>(name: string): T;

  run(fn: (get: <T>(name: string) => T) => void): Injector
}

export type InjectCreator = <T>(string) => T;

export function Injector(...modules: Module[]): Injector {
  return InternalInjector(modules, createLock());
}

function InternalInjector(m: Module[], locker: Locker, parent?: { [key: string]: (string) => any }): Injector {
  const modules = m.reduce((a, m) => (a[m.$name] = m, a), {});
  const values = {};
  const getters = {...parent, ...m.reduce((a, m) => (a[m.$name] = _get, a), {})}

  return {
    define(...modules: Module[]): Injector {
      return InternalInjector(modules, locker, getters);
    },
    init(this: Injector, ...modules: Module[]): Injector {
      if (modules) modules.forEach(create);
      return this;
    },
    get,
    run(this: Injector, fn: (get: <T>(name: string) => T) => void): Injector {
      fn.call(this, get);
      return this;
    }
  }

  function get<T>(type: string): any {
    return type === '$injectCreator'
      ? create
      : type === '$injectGetter'
        ? get
        : (getters[type] || noop)(type);
  }


  function _get<T>(type: string): T {
    return values.hasOwnProperty(type)
      ? values[type]
      : values[type] = locker(type, make);
  }

  function make(type: string): any {
    try {
      return create(modules[type]);
    }
    catch (e) {
      console.log(`Failed to create :${type}`);
      throw e;
    }
  }

  function create<T>(m: Module): T {
    return createFn(
      m.$type,
      Array.isArray(m.$inject) ? m.$inject.map(get) : [],
      Array.isArray(m.$params) ? m.$params : []
    );
  }

  function createFn<T>(type: Function, inject: any[], params: any[]): T {
    return type.apply(null, [...inject, ...params]);
  }
}

type Locker = (type: string, fn: (string) => any) => any;

function createLock(): Locker {
  const locks = [];
  return function lock(type: string, fn: (string) => any): any {
    if (locks.indexOf(type) >= 0) throw `Circular reference ${type}`;
    try {
      locks.push(type);
      return fn.call(null, type);
    }
    finally {
      locks.pop();
    }
  }
}

function noop(type: string) : never {
  throw `don't know how to make ${type}`;
}
