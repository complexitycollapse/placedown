import ContentPersister from "./content-persister.js";
import { getCache } from "../../../auxiliary/cache.js";

export default function PersistenceLayer() {
  const obj = {
    objects: [],
    load: pointer => {
      let persister = undefined;
      if (pointer.isContent) {
        persister = ContentPersister(pointer);
      }

      obj.objects.push(persister);

      getCache(pointer.origin).then(content => persister.setValue(content)).catch(reason => console.error(reason));
    }
  };

  return obj;
}
