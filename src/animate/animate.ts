import {Tween} from "./types";

const head = {tween: null, next: null};

function  removeTween(tween: Tween): void {
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

function tick(time: number) {
  let p = head;
  let a = p.next;

  while (a) {
    //If execute returns true, then animation has completed.
    //Setting p.next = a.next removes a from the list
    if (a.tween.execute(time)) {
      p.next = a.next;
    } else {
      p = a;
    }
    a = a.next;
  }
  if (head.next) {
    requestAnimationFrame(tick);
  }
}

export function animate(tween: Tween) {
  if (!head.next) {
    requestAnimationFrame(tick);
  }
  removeTween(tween);
  head.next = {tween, next: head.next};//new LinkedTween(tween, head.next);
}
