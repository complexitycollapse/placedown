import Persister from "./persister";

export default function ContentPersister(key, initialPointer) {
  const obj = Persister("content", key, initialPointer);
  obj.setValue = value => obj.value = value;

  return obj;
}
