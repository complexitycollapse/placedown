import Persister from "./persister";

export default function LinkPersister(key, initialPointer) {
  const obj = Persister("link", key, initialPointer);
  obj.setValue = value => obj.value = JSON.parse(value);

  return obj;
}
