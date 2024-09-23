import makeObservable from "../observable";

export default function Persister(type, key, initialPointer) {
  const obj = {
    key,
    type,
    state: "immutable",
    pointer: initialPointer,
    value: undefined,
  };

  makeObservable(obj);

  return obj;
}
