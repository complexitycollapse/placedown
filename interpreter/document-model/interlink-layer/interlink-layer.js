import Layer from "../layer";
import Interlinker from "./interlinker";

export default function InterlinkLayer(persistenceLayer) {
  const obj = Layer()
  
  Object.assign(obj, {
    elements: [],
    load: pointer => {
      const persister = persistenceLayer.load(pointer, onPersisterChanged);
      const key = obj.assignId();

      const interlinker = Interlinker(key, pointer, persister);
      obj.elements.push(interlinker);
      obj.notifyObservers();
      return interlinker;
    }
  });

  function onPersisterChanged(persister) {
    const affectedElements = obj.elements.filter(i => persister.contains(i));

    affectedElements.forEach(e => e.onPersisterUpdated());
  }

  return obj;
}
