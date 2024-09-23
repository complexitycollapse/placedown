import { removeItem } from "../../../common/utils";

export default function ContentPersister(key, initialPointer) {
  const obj = {
    key,
    type: "content",
    state: "immutable",
    pointer: initialPointer,
    value: undefined,
    dependents: [],
    setValue: value => obj.value = value,
    subscribe: callback => obj.dependents.push(callback),
    unsubscribe: callback => removeItem(obj.dependents, callback)
  };

  return obj;
}
