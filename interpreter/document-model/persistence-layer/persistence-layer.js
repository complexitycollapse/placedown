import ContentPersister from "./content-persister";
import LinkPersister from "./link-persister";
import EdlPersister from "./edl-persister";
import getCache from "../../../auxiliary/cache";
import Layer from "../layer";

export default function PersistenceLayer() {

  const obj = Layer();
  
  Object.assign(obj, {
    objects: [],
    load: pointer => {
      let persister = undefined;
      const key = obj.assignId();

      if (pointer.isContent) {
        persister = ContentPersister(key, pointer);
      } else if (pointer.leafType === "link pointer") {
        persister = LinkPersister(key, pointer);
      } else if (pointer.leafType === "edl pointer") {
        persister = EdlPersister(key, pointer);
      } else {
        throw new Error("Unsupported pointer: ", JSON.stringify(pointer));
      }

      obj.objects.push(persister);
      obj.notifyObservers();

      getCache().get(pointer.origin).then(content => {
        persister.setValue(content);
        persister.dependents.forEach(callback => callback());
      }).catch(reason => console.error(reason));
    }
  });

  return obj;
}
