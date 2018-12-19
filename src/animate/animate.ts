import {Tween} from "./types";

interface TweenEntry {
  tween: Tween,
  next: TweenEntry
  duration: number,
  end: number,
  start: number,
  init: boolean
}

const head = {next: null} as TweenEntry;
let frameTime: number = 0;
let performance = window.performance;

function removeTween(tween: Tween): void {
  var p = head;
  var a = p.next;
  while (a && !a.tween.matches(tween)) {
    p = a;
    a = a.next;
  }
  if (a) {
    p.next = a.next;
  }
}

function tick() {
  const time = performance.now();
  frameTime = 0;
  let p = head;
  for(let a = p.next;a;a = a.next) {
    if (a.init) {
      a.init = false;
      a.tween.init();
    }
    if (time >= a.end) {
      a.tween.complete();
      p.next = a.next;
    } else {
      a.tween.execute(quadInOut((time - a.start) / a.duration))
      p = a;
    }
  }
  if (head.next) {
    requestAnimationFrame(tick);
  }
}
export function animate(tween: Tween,duration: number) : void {
  if (frameTime===0) {
    requestAnimationFrame(tick);
    frameTime = performance.now();
  }

  removeTween(tween);

  head.next = {
    tween,
    next: head.next,
    start: frameTime,
    end: frameTime + duration,
    duration,
    init: tween.init ? true : false
  };
}

function quadInOut(k: number) {
  return (k *= 2) < 1 ? 0.5 * k * k : -0.5 * (--k * (k - 2) - 1);
}
