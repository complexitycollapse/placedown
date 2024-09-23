import ContentPersister from "./content-persister";
import LinkPersister from "./link-persister";
import EdlPersister from "./edl-persister";
import getCache from "../../../auxiliary/cache";
import { removeItem } from "../../../common/utils";

export default function PersistenceLayer() {

  let unique = 0;
  const subscriptions = [];

  const obj = {
    objects: [],
    load: pointer => {
      let persister = undefined;
      const key = (++unique).toString();
      
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
      for (const callback of subscriptions) { callback(); }

      getCache().get(pointer.origin).then(content => {
        persister.setValue(content);
        persister.dependents.forEach(callback => callback());
      }).catch(reason => console.error(reason));
    },
    subscribeToAdd: callback => subscriptions.push(callback),
    unsubscribeToAdd: callback => removeItem(subscriptions, callback)
  };

  return obj;
}
