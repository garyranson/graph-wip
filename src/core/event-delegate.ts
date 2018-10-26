type EventDelegateCallback<T> = (T) => any;

export type DelegateCallbackCreator = (fn: Function) => any;

interface EventDelegateEntry<T> {
  readonly fn: EventDelegateCallback<T>;
  readonly cb: EventDelegateCallback<T>;
}

export interface EventDelegate<T> {
  add(fn: EventDelegateCallback<T>): EventDelegateEntry<T>;

  remove(fn: EventDelegateEntry<T>): void;

  remove(fn: EventDelegateCallback<T>): void;

  fire(eo?: T): any;
}

export function createDelegate<T>(callbackCreator?: DelegateCallbackCreator): EventDelegate<T> {
  return eventDelegateImpl<T>(callbackCreator || defaultCallbackFactory);
}

function eventDelegateImpl<T>(callbackCreator: DelegateCallbackCreator): EventDelegate<T> {

  let _entries: EventDelegateEntry<T>[] = null;
  let _fire = null;

  function fire(eo:T) : any {
    return (_fire || (_fire = getCallable(_entries)))(eo);
  }

  function add(this: EventDelegate<T>, fn: EventDelegateCallback<T>): EventDelegateEntry<T> {
    let entries = _entries || [];
    let entry = entries.find(e => e.fn === fn);
    if (entry) return entry;
    entry = Object.freeze({fn, cb: callbackCreator(fn)});
    _entries = entries.concat(entry);
    _fire = null;
    return entry;
  }

  function remove(this: EventDelegate<T>, fnOrDelegateEntry: EventDelegateEntry<T> | EventDelegateCallback<T>) {
    if (!_entries) return;

    const clone = (fnOrDelegateEntry instanceof Function)
      ? _entries.filter(e => e.fn != fnOrDelegateEntry)
      : _entries.filter(e => e === fnOrDelegateEntry);

    if (clone.length === _entries.length) return
    _entries = clone;
    this.fire = fire;
  }


  return {add, remove, fire}
}

function getCallable<T>(e: EventDelegateEntry<T>[]): EventDelegateCallback<T> {
  switch (e ? e.length : 0) {
    case 0:
      return cb0;
    case 1:
      return e[0].cb;
    case 2:
      return cb2(e[0].cb, e[1].cb);
    case 3:
      return cb3(e[0].cb, e[1].cb, e[2].cb);
    case 4:
      return cb4(e[0].cb, e[1].cb, e[2].cb, e[3].cb);
    case 5:
      return cb5(e[0].cb, e[1].cb, e[2].cb, e[3].cb, e[4].cb);
    default:
      return cbN(e.map(e => e.cb));
  }
}

function cb0() {
}

function cb2<T>(f1: EventDelegateCallback<T>, f2: EventDelegateCallback<T>): EventDelegateCallback<T> {
  return obj => {
    let rc = f1(obj);
    if (rc === undefined) rc = f2(obj);
    return rc;
  }
}

function cb3<T>(f1: EventDelegateCallback<T>, f2: EventDelegateCallback<T>, f3: EventDelegateCallback<T>): EventDelegateCallback<T> {
  return obj => {
    let rc = f1(obj);
    if (rc === undefined) rc = f2(obj);
    if (rc === undefined) rc = f3(obj);
    return rc;
  }
}

function cb4<T>(f1: EventDelegateCallback<T>, f2: EventDelegateCallback<T>, f3: EventDelegateCallback<T>, f4: EventDelegateCallback<T>): EventDelegateCallback<T> {
  return obj => {
    let rc = f1(obj);
    if (rc === undefined) rc = f2(obj);
    if (rc === undefined) rc = f3(obj);
    if (rc === undefined) rc = f4(obj);
    return rc;
  }
}

function cb5<T>(f1: EventDelegateCallback<T>, f2: EventDelegateCallback<T>, f3: EventDelegateCallback<T>, f4: EventDelegateCallback<T>, f5: EventDelegateCallback<T>): EventDelegateCallback<T> {
  return obj => {
    let rc = f1(obj);
    if (rc === undefined) rc = f2(obj);
    if (rc === undefined) rc = f3(obj);
    if (rc === undefined) rc = f4(obj);
    if (rc === undefined) rc = f5(obj);
    return rc;
  }
}

function cbN<T>(c: EventDelegateCallback<T>[]): EventDelegateCallback<T> {
  return obj => {
    for (const cb of c) {
      let rc = cb(obj);
      if (rc !== undefined) return rc;
    }
  }
}

function defaultCallbackFactory(fn: Function) {
  return (e) => {
    try {
      fn.call(null, e);
    }
    catch (e) {
      console.trace(e);
    }
  }
}
