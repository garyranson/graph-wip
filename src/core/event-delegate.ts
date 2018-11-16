type EventDelegateCallback<T> = (T) => any;

export type ExceptionCallback = (ex: any) => void;

export interface EventDelegate<T> {
  add(fn: EventDelegateCallback<T>): EventDelegateCallback<T>;
  remove(fn: EventDelegateCallback<T>): void;
  fire(eo?: T): any;
}

export function createDelegate<T>(callbackCreator?: ExceptionCallback): EventDelegate<T> {
  return eventDelegateImpl<T>(callbackCreator);
}

function eventDelegateImpl<T>(callbackCreator: ExceptionCallback): EventDelegate<T> {

  let _entries: EventDelegateCallback<T>[] = null;

  function fire(eo:T) : any {
    if(!_entries) return;
    try {
      for (let i = 0; i < _entries.length; i++) {
        const rc = _entries[i](eo);
        if (rc !== undefined) return rc;
      }
    }
    catch(ex) {
      if (!callbackCreator) throw ex;
      callbackCreator(ex);
    }
  }

  function add(this: EventDelegate<T>, fn: EventDelegateCallback<T>): EventDelegateCallback<T> {
    if(!fn) return;
    let entries = _entries || [];
    if (entries.indexOf(fn) === -1)
      _entries = entries.concat(fn);
    return fn;
  }

  function remove(this: EventDelegate<T>, fnOrDelegateEntry: EventDelegateCallback<T>) {
    if (!_entries) return;
    const clone = _entries.filter(e => e != fnOrDelegateEntry);
    if (clone.length === _entries.length) return;
    _entries = clone;
  }

  return {add, remove, fire}
}
