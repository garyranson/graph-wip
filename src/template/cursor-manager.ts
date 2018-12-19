import {Widget} from "template/widget";
import {StateIdType} from "core/types";
import {ViewController} from "template/view-controller";


export interface CursorManager {
  create(type: string, id?: StateIdType): Widget;

  createLinked(type: string, id?: StateIdType): Widget;

  release(type: string, widget: Widget, id?: StateIdType): void;

  releaseLinked(type: string, widget: Widget, id: StateIdType): void;
}

export const CursorManagerModule = {
  $type: CursorManager,
  $name: 'CursorManager',
  $inject: ['ViewController'],
}

interface CursorEntry {
  widget: Widget;
  linked: boolean;
}

function CursorManager(view: ViewController): CursorManager {
  const cache = CachedLinkedList<CursorEntry>(5000, housekeeping);
  return {
    create(type: string, id?: StateIdType): Widget {
      return _create(type, false, id).addClass('px-off');
    },
    createLinked(type: string, id: StateIdType): Widget {
      return _create(type, true, id).addClass('px-off');
    },
    release(type: string, widget: Widget, id?: StateIdType): void {
      _release(type, widget, false, id);
    },
    releaseLinked(type: string, widget: Widget, id: StateIdType): void {
      _release(type, widget, true, id);
    }
  }

  function _create(type: string, linked: boolean, id: StateIdType): Widget {
    const v = cache.remove(type, id);
    return v
      ? v.widget
      : linked
        ? view.createLinkedWidget(type, id)
        : view.createToolWidget(type);
  }

  function _release(type: string, widget: Widget, linked: boolean, id: StateIdType): void {
    if (!widget) return;
    widget.addClass('px-off');
    cache.add(type, id, {widget, linked});
  }

  function housekeeping(a: CursorEntry,id: string): void {
    if (a.linked)
      view.removeLinkedWidget(a.widget, id);
    else
      a.widget.remove();
  }
}

function CachedLinkedList<T>(interval: number, cb: (v:T,k2:string,k1:string) => void) {
  const head = {next: null};
  interval = interval || 5000;
  const perf = window.performance;
  let timer = 0;

  return {
    add(key1: string, key2: string, value: T): void {
      head.next = {ts: perf.now() + interval, next: head.next, value, key1, key2};
      if (!timer)         timer = setInterval(tick, (interval * 2) + 100);
    },
    get(key1: string, key2: string): T {
      let p = head;
      for (let i = p.next; i; i = i.next) {
        if (i.key1 === key1 && i.key2 === key2) {
          return i.value;
        }
        p = i;
      }
    },
    remove(key1: string, key2: string): T {
      let p = head;
      for (let i = p.next; i; i = i.next) {
        if (i.key1 === key1 && i.key2 === key2) {
          p.next = i.next;
          return i.value;
        }
        p = i;
      }
    }
  }

  function tick() {
    const ts = perf.now();
    let p = head;
    for (let a = p.next; a; a = a.next) {
      if (ts > a.ts) {
        cb(a.value,a.key2, a.key1);
        p.next = a.next;
      } else {
        p = a;
      }
    }
    if (!head.next) {
      clearInterval(timer);
      timer = 0;
    }
  }
}
