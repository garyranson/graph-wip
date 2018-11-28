
/*
  Build tree of changed Containers. Flag each container with changed vertices as "required re-layout"

  Traverse tree - Depth first

  For each in tree
    if "required re-layout" then Layout
    If size changed then flag parent - as "requires re-layout"
 */

import {StateIdType} from "core/types";
import {Graph} from "modules/graph";

export const TreeBuilderModule = {
  $type: TreeBuilder,
  $inject: ['Graph'],
  $name: 'TreeBuilder'
}

export interface LayoutLeaf {
  id: StateIdType,
  children: LayoutLeaf[],
  layout: boolean
}

export interface TreeBuilder {
  (create: StateIdType[], force: StateIdType[]): LayoutLeaf;
}

function TreeBuilder(graph: Graph) : TreeBuilder {
  return function bingo(create: StateIdType[], force: StateIdType[]): LayoutLeaf {
    const tree = create.reduce(buildPrimaryTree, new Map<StateIdType, LayoutLeaf>());
    if (force) {
      force.reduce(appendForcedLayouts, tree)
    }
    return tree.get(graph.getRootId());
  }

  function buildPrimaryTree(layoutmap: Map<StateIdType, LayoutLeaf>, id: StateIdType) {
    return graph.getRootId() === id
      ? layoutmap
      : appendForcedLayouts(layoutmap, graph.getParentId(id));
  }

  function appendForcedLayouts(layoutmap: Map<StateIdType, LayoutLeaf>, parent: StateIdType) {
    let leaf = layoutmap.get(parent);
    if (leaf) {
      leaf.layout = true;
      return layoutmap;
    }
    leaf = {
      id: parent,
      children: [],
      layout: true
    };
    layoutmap.set(parent, leaf);

    const root = graph.getRootId();

    while (parent !== root) {
      parent = graph.getParentId(parent);
      let parentLeaf = layoutmap.get(parent);
      if (parentLeaf) {
        parentLeaf.children.push(leaf);
        return layoutmap;
      }
      leaf = {
        id: parent,
        children: [leaf],
        layout: false
      }
      layoutmap.set(parent, leaf);
    }
    return layoutmap;
  }
}
