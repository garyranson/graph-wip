declare type GpDelegateCallback<T> =  (T) => boolean|void;

let frozenObject = Object.freeze({});


class GpDelegateEntry<T> {
  readonly fn: GpDelegateCallback<T>;
  readonly context: object;
  readonly callback: GpDelegateCallback<T>;

  constructor(fn: GpDelegateCallback<T>, context: object) {
    this.fn = fn;
    this.context = context;
    this.callback = fn.bind(context ? context : frozenObject);
  }
}

export default class GpDelegate<T> {
  private entries: GpDelegateEntry<T>[] = null;

  add(fn: GpDelegateCallback<T>, context?: object) {
    let entries = this.entries;
    if (!entries) {
      entries = this.entries = [];
    } else if (entries.find(e => e.fn == fn && e.context == context)) {
      return;
    }
    entries.push(new GpDelegateEntry(fn, context));
    this.fire = getCallable(entries);
  }

  remove(fn: GpDelegateCallback<T>, context?: object) {
    let entries = this.entries;
    if (!entries) {
      return;
    }
    let q = entries.filter(e => e.fn != fn || e.context != context);

    if (q.length != entries.length) {
      this.entries = q;
      this.fire = getCallable(q);
    }
  }

  disable() {
    this.fire = cb0;
  }

  enable() {
    this.fire = getCallable(this.entries);
  }

  fire(eo: T) : void {
  } //GpDelegateCallback<T> = cb0;
}

function getCallable<T>(e: GpDelegateEntry<T>[]) : GpDelegateCallback<T> {
  switch (e ? e.length : 0) {
    case 0:
      return cb0;
    case 1:
      return cb1(e[0].callback);
    case 2:
      return cb2(e[0].callback, e[1].callback);
    case 3:
      return cb3(e[0].callback, e[1].callback, e[2].callback);
    case 4:
      return cb4(e[0].callback, e[1].callback, e[2].callback, e[3].callback);
    case 5:
      return cb5(e[0].callback, e[1].callback, e[2].callback, e[3].callback, e[4].callback);
    default:
      return cbN(e.map(e=> e.callback));
  }
}


function cb0() {
}

function cb1<T>(f1: GpDelegateCallback<T>): GpDelegateCallback<T> {
  return obj => {
    f1(obj);
  }
}

function cb2<T>(f1: GpDelegateCallback<T>, f2: GpDelegateCallback<T>): GpDelegateCallback<T> {
  return obj => {
    f2(obj);
    f1(obj);
  }
}

function cb3<T>(f1: GpDelegateCallback<T>, f2: GpDelegateCallback<T>, f3: GpDelegateCallback<T>): GpDelegateCallback<T> {
  return obj => {
    f3(obj);
    f2(obj);
    f1(obj);
  }
}

function cb4<T>(f1: GpDelegateCallback<T>, f2: GpDelegateCallback<T>, f3: GpDelegateCallback<T>, f4: GpDelegateCallback<T>): GpDelegateCallback<T> {
  return obj => {
    f4(obj);
    f3(obj);
    f2(obj);
    f1(obj);
  }
}

function cb5<T>(f1: GpDelegateCallback<T>, f2: GpDelegateCallback<T>, f3: GpDelegateCallback<T>, f4: GpDelegateCallback<T>, f5: GpDelegateCallback<T>): GpDelegateCallback<T> {
  return obj => {
    f5(obj);
    f4(obj);
    f3(obj);
    f2(obj);
    f1(obj);
  }
}

function cbN<T>(c: GpDelegateCallback<T>[]): GpDelegateCallback<T> {
  return obj => {
    for (const cb of c) {
      cb(obj);
    }
  }
}
