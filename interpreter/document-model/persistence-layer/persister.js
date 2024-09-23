import { removeItem } from "../../../common/utils";

export default function Persister(type, key, initialPointer) {
  const obj = {
    key,
    type,
    state: "immutable",
    pointer: initialPointer,
    value: undefined,
    dependents: [],
    subscribe: callback => obj.dependents.push(callback),
    unsubscribe: callback => removeItem(obj.dependents, callback)
  };

  return obj;
}
