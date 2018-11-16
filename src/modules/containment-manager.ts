import {StateIdType} from "core/types";
import {Store} from "modules/store";

export interface ContainmentManager {
  canContain(parent: StateIdType, child: StateIdType) : boolean;
}

export const ContainmentManagerModule = {
  $type: ContainmentManager,
  $inject: ['Store'],
  $name: 'ContainmentManager'
}

function ContainmentManager(store: Store) : ContainmentManager {
  return {
    canContain
  }

  function canContain(parent: StateIdType, child: StateIdType) : boolean {
    if(!parent || parent === child) return;
    if(parent===store.getRootId()) return true; //temp

    const target = store.getState(parent);
    const source = store.getState(child);

    if(!target || !source) return false;

    console.log('under::',parent,'over::',child,target, target.$type.canContain);
    const tc = target.$type.canContain;

    if(!tc) return false; //target cannot contain anything
console.log(`source ${tc.join(',')} type==${source.$type.name}`);

    if(tc.indexOf(source.$type.name)===-1) return false;

    return true;
  }
}
