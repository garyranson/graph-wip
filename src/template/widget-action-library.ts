import {WidgetActionFactory, WidgetTemplateAction} from "./types";
import {Compiler} from "expression-compiler";
import {BorderAction} from "template/actions/border";
import {WidthAction} from "template/actions/width";
import {SizeAction} from "template/actions/size";
import {XyRatioAction} from "template/actions/xy-ratio";
import {CxyRatioAction} from "template/actions/cxy-ratio";
import {ConnectorAction} from "template/actions/connector";
import {TextAction} from "template/actions/text";
import {PositionAction} from "template/actions/position";
import {AntiPositionAction} from "template/actions/anti-position";
import {BoundsAction} from "template/actions/bounds";
import {TextTemplateAction} from "template/actions/text-template";
import {ConnectorXyAction} from "template/actions/connector-xy";
import {ConnectorPathAction} from "template/actions/connector-path";

export interface ActionModule {
  $name: string;
  $type: string;
  $constant: (...args) => WidgetTemplateAction
  $expr: (...args) => WidgetTemplateAction
}

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
    BorderAction,
    WidthAction,
    SizeAction,
    XyRatioAction,
    CxyRatioAction,
    ConnectorAction,
    TextAction,
    PositionAction,
    AntiPositionAction,
    BoundsAction,
    TextTemplateAction,
    ConnectorAction,
    ConnectorXyAction,
    ConnectorPathAction
  ].map(createActionModule)
    .reduce((a, e) => a.set('data-' + e.$name, e.$factory), new Map<string, WidgetActionCreator>());

  return {
    get: function get(name: string): WidgetActionFactory {
      return cache.get(name);
    },
    has: function has(name: string) : boolean {
      return cache.has(name)
    },
    register: function register(name: string, fn: WidgetActionFactory) {
      cache.set(name, fn);
    }
  }
}

type WidgetActionCreator = (string) => WidgetTemplateAction

function createActionModule(o: ActionModule) {
  const t = o.$type;
  if (t === 'simple') {
    return {$name: o.$name, $factory: makeFactory(o)};
  } else if (t === 'text') {
    return {$name: o.$name, $factory: makeTextFactory(o)};
  } else if (t === 'self') {
    console.log('self: ' + o.$name);
    return {$name: o.$name, $factory: o.$constant};
  }
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

function makeTextFactory(module: ActionModule): WidgetActionCreator {
  return ActionExpressionCache(make);
  function make(expr: string) : WidgetTemplateAction {
    const c = XCompiler.toContent(expr);
    return module.$constant(c.toFunction());
  }
}
function makeFactory(module: ActionModule): (string) => WidgetTemplateAction {
  return ActionExpressionCache(make);
  function make(expr: string): WidgetTemplateAction {
    const r = XCompiler.toList(expr);
    return (r.length === 0 || r.every((i) => i.isConstant()))
      ? module.$constant(r.map((i) => i.eval(null)))
      : module.$expr(r.map((i) => i.toFunction()));
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

