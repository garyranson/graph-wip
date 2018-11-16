import {ModelLoader} from "modules/model-loader";
import {DiagramLoader, loadDiagram} from "./loader/diagram-loader";


export function bootstrap(container: Element | string): void {
  loadDiagram('src/demo-model.json').then((x: DiagramLoader) => {
    const app = x.init(container);
    const loader = app.get<ModelLoader>('ModelLoader');
    loader.load(x.doc);
  })
}

