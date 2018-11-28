import {Easing, Tween} from "./types";
import {Easings} from "animate/easings";

interface TweenEntry {
  tween: Tween,
  next: TweenEntry
  duration?: number,
  end?: number,
  start?: number,
  easing?: Easing,
  first?: boolean
}

const head : TweenEntry = {tween: null, next: null};
const defaultEasing  = Easings.easeInOutQuad;

let gtime: number = 0;

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
  const time = window.performance.now();
  gtime = 0;
  let p = head;
  let a = p.next;
  while (a) {
    if(a.first) {
      a.first = false;
      a.tween.init && a.tween.init();
    }
    if(time>=a.start+a.duration) {
      a.tween.complete();
      p.next = a.next;
    } else {
      a.tween.execute(time - a.start,a.duration, a.easing)
      p = a;
    }
    a = a.next;
  }
  if (head.next) {
    requestAnimationFrame(tick);
  }
}

export function animate(tween: Tween,duration: number, easing?: Easing) : void {
  if (!head.next) {
    requestAnimationFrame(tick);
  }
  removeTween(tween);

  if(gtime===0) // ensures that all new animations in frame get same start time
    gtime = window.performance.now();

  head.next = {
    tween,
    next: head.next,
    start: gtime,
    duration,
    first: true,
    easing: easing || defaultEasing
  };
}
