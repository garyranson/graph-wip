import {ModelController} from "modules/model-controller";

export const ModelLoaderModule = {
  $type: ModelLoader,
  $inject: ['ModelController'],
  $name: 'ModelLoader'
}

export interface ModelLoader {
  load(doc: any):void;
}

export function ModelLoader(model: ModelController,doc: any): ModelLoader {

  return {
    load(doc: any) {
      const root = model.createRoot(null, doc.model.type);
      doc.model.vertices.forEach((v) => {
        model.createVertex(v.id, v.type, {x: v.x, y: v.y, width: v.width, height: v.height}, v.parent || root.id);
      });
      return model;
    }
  }
}

