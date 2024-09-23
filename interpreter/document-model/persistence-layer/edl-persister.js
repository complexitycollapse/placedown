import Persister from "./persister";

export default function EdlPersister(key, initialPointer) {
  const obj = Persister("edl", key, initialPointer);
  obj.setValue = value => obj.value = JSON.parse(value);

  return obj;
}
