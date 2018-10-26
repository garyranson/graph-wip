import {WidgetTemplateAction, WidgetTemplateExec} from "./types";

function rz0(gp: object) {
}

function rz1(el1:Element,act1:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
  }
}
function rz2(el1:Element, el2:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
  }
}
function rz3(el1:Element, el2:Element, el3:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction, act3:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
    act3(el3,gp);
  }
}
function rz4(el1:Element, el2:Element, el3:Element, el4:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction, act3:WidgetTemplateAction, act4:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
    act3(el3,gp);
    act4(el4,gp);
  }
}
function rz5(el1:Element, el2:Element, el3:Element, el4:Element, el5:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction, act3:WidgetTemplateAction, act4:WidgetTemplateAction, act5:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
    act3(el3,gp);
    act4(el4,gp);
    act5(el5,gp);
  }
}
function rz6(el1:Element, el2:Element, el3:Element, el4:Element, el5:Element, el6:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction, act3:WidgetTemplateAction, act4:WidgetTemplateAction, act5:WidgetTemplateAction, act6:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
    act3(el3,gp);
    act4(el4,gp);
    act5(el5,gp);
    act6(el6,gp);
  }
}

function rz7(el1:Element, el2:Element, el3:Element, el4:Element, el5:Element, el6:Element, el7:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction, act3:WidgetTemplateAction, act4:WidgetTemplateAction, act5:WidgetTemplateAction, act6:WidgetTemplateAction, act7:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
    act3(el3,gp);
    act4(el4,gp);
    act5(el5,gp);
    act6(el6,gp);
    act7(el7,gp);
  }
}

function rz8(el1:Element, el2:Element, el3:Element, el4:Element, el5:Element, el6:Element, el7:Element, el8:Element, act1:WidgetTemplateAction, act2:WidgetTemplateAction, act3:WidgetTemplateAction, act4:WidgetTemplateAction, act5:WidgetTemplateAction, act6:WidgetTemplateAction, act7:WidgetTemplateAction, act8:WidgetTemplateAction) {
  return function(gp: object) {
    act1(el1,gp);
    act2(el2,gp);
    act3(el3,gp);
    act4(el4,gp);
    act5(el5,gp);
    act6(el6,gp);
    act7(el7,gp);
    act8(el8,gp);
  }
}


function rzN(e:Element[],a:WidgetTemplateAction[]) {
  return function(gp: object) {
    for(let i=0;i<e.length;i++) {
      a[i](e[i],gp);
    }
  }
}

export function widgetExecReducer(e: Element[], a: WidgetTemplateAction[]) : WidgetTemplateExec {
  switch (e.length) {
    case 0 :
      return rz0;
    case 1 :
      return rz1(e[0], a[0]);
    case 2 :
      return rz2(e[0], e[1], a[0], a[1]);
    case 3 :
      return rz3(e[0], e[1], e[2], a[0], a[1], a[2]);
    case 4 :
      return rz4(e[0], e[1], e[2], e[3], a[0], a[1], a[2], a[3]);
    case 5 :
      return rz5(e[0], e[1], e[2], e[3], e[4], a[0], a[1], a[2], a[3], a[4]);
    case 6 :
      return rz6(e[0], e[1], e[2], e[3], e[4], e[5], a[0], a[1], a[2], a[3], a[4], a[5]);
    case 7 :
      return rz7(e[0], e[1], e[2], e[3], e[4], e[5], e[6], a[0], a[1], a[2], a[3], a[4], a[5], a[6]);
    case 8 :
      return rz8(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7]);
    default :
      return rzN(e, a);
  }
}
