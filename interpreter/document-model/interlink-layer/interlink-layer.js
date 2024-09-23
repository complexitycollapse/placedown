import Layer from "../layer";
import Interlinker from "./interlinker";

export default function InterlinkLayer(persistenceLayer) {
  const obj = Layer()
  
  Object.assign(obj, {
    elements: [],
    load: pointer => {
      const persister = persistenceLayer.load(pointer);
      const key = obj.assignId();

      const interlinker = Interlinker(key, persister);
      obj.elements.push(interlinker);
      obj.notifyObservers();
      return interlinker;
    }
  });

  return obj;
}
