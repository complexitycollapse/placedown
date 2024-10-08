import ContentPersister from "./content-persister";
import LinkPersister from "./link-persister";
import EdlPersister from "./edl-persister";
import getCache from "../../../auxiliary/cache";
import Layer from "../layer";

export default function PersistenceLayer() {

  const obj = Layer();
  
  Object.assign(obj, {
    elements: [],
    load: (pointer, callback) => {
      let persister = obj.elements.find(o => o.contains(pointer) && pointer.state === "immutable");

      if (persister) {
        if (callback) {
          if (persister.value === undefined) {
            persister.subscribe(callback);
          } else {
            setImmediate(() => callback(persister));
          }
        }
        
        return persister;
      }

      return createPersister(obj, pointer, callback);
    }
  });

  return obj;
}

function createPersister(obj, pointer, callback) {
  let persister = undefined;
  const key = obj.assignId();
  const origin = pointer.origin;

  if (pointer.isContent) {
    persister = ContentPersister(key, origin);
  } else if (pointer.leafType === "link pointer") {
    persister = LinkPersister(key, origin);
  } else if (pointer.leafType === "edl pointer") {
    persister = EdlPersister(key, origin);
  } else {
    throw new Error("Unsupported pointer: ", JSON.stringify(pointer));
  }

  obj.elements.push(persister);
  if (callback) { persister.subscribe(callback); }
  obj.notify();

  getCache().get(origin).then(content => {
    persister.setValue(content);
    persister.notify();
  }).catch(reason => console.error(reason));

  return persister;
}
