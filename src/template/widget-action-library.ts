import {WidgetActionFactory, WidgetTemplateAction} from "./types";
import {Compiler} from "expression-compiler";
import {BorderAction} from "template/actions/border";
import {WidthAction} from "template/actions/width";
import {SizeAction} from "template/actions/size";
import {XyRatioAction} from "template/actions/xy-ratio";
import {ConnectorAction} from "template/actions/connector";
import {TextAction} from "template/actions/text";
import {TextTemplateAction} from "template/actions/text-template";
import {ConnectorXyAction} from "template/actions/connector-xy";
import {ConnectorPathAction} from "template/actions/connector-path";
import {ParentSizeAction} from "template/actions/fill-parent";
import {CanvasAction} from "template/actions/canvas";
import {TranslateAction} from "template/actions/translate";
import {HeightAction} from "template/actions/height";
import {AlignAction} from "template/actions/connector-align";
import {PortAction} from "template/actions/port";

export interface WidgetActionLibrary {
  get(name: string): WidgetActionFactory;

  has(name: string): boolean;
}

export const WidgetActionLibraryModule = {
  $name: 'WidgetActionLibrary',
  $type: WidgetActionLibrary
}

function WidgetActionLibrary(): WidgetActionLibrary {

  const odc = OnDemandCompiler();

  const cache = [
    ParentSizeAction,
    BorderAction,
    WidthAction,
    HeightAction,
    SizeAction,
    XyRatioAction,
    ConnectorAction,
    TextAction,
    TextTemplateAction,
    ConnectorAction,
    ConnectorXyAction,
    ConnectorPathAction,
    CanvasAction,
    TranslateAction,
    AlignAction,
    PortAction
  ].reduce((a, m) => a.set('data-' + m.$name, createActionModule(odc, m.$item, m.$type)), new Map<string, WidgetActionCreator>());

  return {
    get: (name: string) => cache.get(name),
    has: (name: string) => cache.has(name)
  }
}

type WidgetActionCreator = (string, elementType?: string) => WidgetTemplateAction

function createActionModule(odc: () => Compiler, t: string, fn: Function): WidgetActionCreator {
  return t === 'expr'
    ? makeExprFactory(fn)
    : t === 'text'
      ? makeTextFactory(odc, fn)
      : t === 'split'
        ? makeSplitFactory(fn)
        : t === 'self'
          ? fn as WidgetActionCreator
          : noop as WidgetActionCreator;
}

function noop(name: string): WidgetTemplateAction {
  console.log(`don't know how to create action type ${name}`);
  return () => {
  };
}

function ActionExpressionCache<T>(make: (string, elementType?: string) => T) {
  const cache = new Map<string, T>();
  return function (expr: string, elementType: string): T {
    if (cache.has(expr)) return cache.get(expr);
    const m = make(expr, elementType);
    cache.set(expr, m);
    return m;
  }
}

function makeTextFactory(odc: () => Compiler, fn: Function): WidgetActionCreator {
  return ActionExpressionCache((expr: string, elementType?: string) => {
    const r = odc().compileContent(expr);
    const c = (!r || r.isConstant() ? true : false);
    return fn.call(null, c, c ? r && r.eval(null) : r.toFunction(), elementType);
  });
}

function makeExprFactory(fn: Function): WidgetActionCreator {
  return ActionExpressionCache((expr: string, elementType?: string) => {
    const r = (new Compiler()).compileList(expr) || [];
    const c = (r.length === 0 || r.every((i) => i.isConstant()));
    return fn.call(
      null,
      c,
      c ? r && r.map((i) => i.eval(null))
        : r.map((i) => i.toFunction())
      , elementType
    );
  });
}

function makeSplitFactory(fn: Function): WidgetActionCreator {
  return ActionExpressionCache((expr: string, elementType?: string) => {
    return fn.call(
      null,
      expr.trim().split(/(?:\s+[,]?\s*)|,\s*/).map((s) => s.toLowerCase().trim()),
      elementType
    );
  });
}

const OnDemandCompiler = function () {
  let c: Compiler;
  let t: number;

  return function (): Compiler {
    if (t) clearTimeout(t);
    t = setTimeout(kill, 5000);
    return c ? c : (c = new Compiler());
  }

  function kill() {
    c = null;
    t = 0;
  }
}
