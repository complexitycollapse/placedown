import ContentPersister from "./content-persister";
import getCache from "../../../auxiliary/cache";
import { removeItem } from "../../../common/utils";

export default function PersistenceLayer() {

  let unique = 0;
  const subscriptions = [];

  const obj = {
    objects: [],
    load: pointer => {
      let persister = undefined;
      if (pointer.isContent) {
        persister = ContentPersister((++unique).toString(), pointer);
      } else {
        throw new Error("Unsupported pointer: ", JSON.stringify(pointer));
      }

      obj.objects.push(persister);
      for (const callback of subscriptions) { callback(); }

      getCache().get(pointer.origin).then(content => persister.setValue(content)).catch(reason => console.error(reason));
    },
    subscribeToAdd: callback => subscriptions.push(callback),
    unsubscribeToAdd: callback => removeItem(subscriptions, callback)
  };

  return obj;
}
