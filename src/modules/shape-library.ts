import {ShapeType} from "core/types";


export const ShapeLibraryModule = {
  $type: ShapeLibrary,
  $inject: [],
  $name: 'ShapeLibrary'
}

export interface ShapeLibrary {
  get(name: string): ShapeType;

  register(name: string, type: ShapeType): ShapeType;
}

export function ShapeLibrary() {
  const cache = new Map<string, ShapeType>();

  const t =
    [
      {
        name: "object",
        parent: null,
        minumumSize: {width: 0, height: 0},
        maximumSize: {width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER},
        canContain: null,
        layoutManager: null,
        returnType: null
      },
      {
        name: "shape",
        parent: null,
        minumumSize: {width: 0, height: 0},
        maximumSize: {width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER},
        canContain: null,
        layoutManager: null,
        returnType: null,
        isSelectable: true
      },
      {
        name: "container",
        parent: null,
        minumumSize: {width: 0, height: 0},
        maximumSize: {width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER},
        canContain: ['select', 'container','default'],
        isSelectable: true,
        layoutManager: null,
        returnType: null,
        hasFeedback: 'flow'
      },
      {
        name: "$node-root",
        parent: "object",
        minumumSize: {width: 0, height: 0},
        maximumSize: {width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER},
        canContain: ['object','container','shape','default','select'],
        layoutManager: null,
        hasFeedback: 'simple',
        returnType: null
      },
      {
        name: "$container",
        parent: 'container',
        minumumSize: {width: 80, height: 120},
        maximumSize: {width: Number.MAX_SAFE_INTEGER, height: Number.MAX_SAFE_INTEGER},
        canContain: ['select', 'container', 'default'],
        layoutManager: null,
        returnType: null,
        isSelectable: true,
        hasFeedback: 'flow'
      },
      {
        name: "default",
        parent: 'shape',
        minumumSize: {width: 120, height: 80},
        maximumSize: {width: 240, height: 160},
        canContain: null,
        layoutManager: null,
        returnType: null,
        isSelectable: true,
      },
      ,
      {
        name: "select",
        parent: 'shape',
        minumumSize: {width: 120, height: 80},
        maximumSize: {width: 1240, height: 290},
        canContain: null,
        layoutManager: null,
        returnType: null,
        isSelectable: true,
      },
    ];

  t.forEach((e) => register(e.name, e));

  return {
    get(name: string): ShapeType {
      return cache.get(name);
    },
    register
  }

  function register(name: string, type: ShapeType): ShapeType {
    cache.set(name, type);
    return type;
  }
}
