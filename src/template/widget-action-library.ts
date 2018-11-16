import {WidgetActionFactory, WidgetTemplateAction} from "./types";
import {Compiler} from "expression-compiler";
import {BorderAction} from "template/actions/border";
import {WidthAction} from "template/actions/width";
import {SizeAction} from "template/actions/size";
import {XyRatioAction} from "template/actions/xy-ratio";
import {CxyRatioAction} from "template/actions/cxy-ratio";
import {ConnectorAction} from "template/actions/connector";
import {TextAction} from "template/actions/text";
import {BoundsAction} from "template/actions/bounds";
import {TextTemplateAction} from "template/actions/text-template";
import {ConnectorXyAction} from "template/actions/connector-xy";
import {ConnectorPathAction} from "template/actions/connector-path";
import {ParentSizeAction} from "template/actions/fill-parent";
import {CanvasAction} from "template/actions/canvas";
import {TranslateAction} from "template/actions/translate";
import {PositionAction} from "template/actions/position";

export interface WidgetActionLibrary {
  get(name: string): WidgetActionFactory;
  has(name: string) :boolean;
  register(name: string, fn: WidgetActionFactory);
}

export const WidgetActionLibraryModule = {
  $name: 'WidgetActionLibrary',
  $type: WidgetActionLibrary
}
function WidgetActionLibrary(): WidgetActionLibrary {

  const cache = [
    ParentSizeAction,
    BorderAction,
    WidthAction,
    SizeAction,
    XyRatioAction,
    CxyRatioAction,
    ConnectorAction,
    TextAction,
    BoundsAction,
    TextTemplateAction,
    ConnectorAction,
    ConnectorXyAction,
    ConnectorPathAction,
    CanvasAction,
    TranslateAction,
    PositionAction
  ].reduce((a, m) => a.set('data-' + m.$name, createActionModule(m.$ftype,m.$type)), new Map<string, WidgetActionCreator>());

  return {
    get: (name: string) => cache.get(name),
    has: (name: string) => cache.has(name),
    register: (name: string, fn: WidgetActionFactory) => {
      cache.set(name, fn);
    }
  }
}

type WidgetActionCreator = (string) => WidgetTemplateAction

function createActionModule(t: string, fn: Function) : WidgetActionCreator {
  return t === 'expr'
    ? makeFactory(fn)
    : t === 'text'
      ? makeTextFactory(fn)
      : t === 'self'
        ? fn as WidgetActionCreator
        : noop as WidgetActionCreator;
}

function noop(name: string) : WidgetTemplateAction {
  console.log(`don't know how to create action type ${name}`);
  return () => {};
}

function ActionExpressionCache<T>(make: (string) => T) {
  const cache = new Map<string, T>();
  return function (expr: string): T {
    if (cache.has(expr)) return cache.get(expr);
    const m = make(expr);
    cache.set(expr, m);
    return m;
  }
}

function makeTextFactory(fn: Function): WidgetActionCreator {
  return ActionExpressionCache(make);
  function make(expr: string) : WidgetTemplateAction {
    const r = XCompiler.toContent(expr);
    const c = (!r || r.isConstant() ? true : false);
    return fn.call(null,
      c,
      c
        ? r && r.eval(null)
        : r.toFunction()
    );
  }
}
function makeFactory(fn: Function): (string) => WidgetTemplateAction {
  return ActionExpressionCache(make);

  function make(expr: string): WidgetTemplateAction {
    const r = XCompiler.toList(expr);
    const c = (r.length === 0 || r.every((i) => i.isConstant()));
    return fn.call(null,
      c,
      c
        ? r && r.map((i) => i.eval(null))
        : r.map((i) => i.toFunction())
    );
  }
}

const XCompiler = {
  toList: function toList(expr: string) {
    return (new Compiler()).compileList(expr) || [];
  },
  toContent: function toExpr(expr: string) {
    return (new Compiler()).compileContent(expr);
  }
};
