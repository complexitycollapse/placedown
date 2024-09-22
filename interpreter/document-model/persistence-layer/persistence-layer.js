import ContentPersister from "./content-persister";
import getCache from "../../../auxiliary/cache";

export default function PersistenceLayer() {

  let unique = 0;

  const obj = {
    objects: [],
    load: pointer => {
      let persister = undefined;
      if (pointer.isContent) {
        persister = ContentPersister((++unique).toString(), pointer);
      }

      obj.objects.push(persister);

      getCache(pointer.origin).then(content => persister.setValue(content)).catch(reason => console.error(reason));
    }
  };

  return obj;
}
