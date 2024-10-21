import Persister from "./persister";
import Link from "../../../data-model/link";
import { deserializePointer, deserializeType } from "./deserializer-methods";

export default function LinkPersister(key, initialPointer) {
  const obj = Persister("link", key, initialPointer);
  obj.setValue = value => obj.value = deserialize(value);
  obj.firstEnd = name => obj.value.ends.find(e => e.name === name);
  obj.parameterValue = name => {
    const end = obj.firstEnd(name);
    if (end && end.pointers.length > 0) {
      return end.pointers[0].value;
    }
  };

  return obj;
}

function deserialize(linkString) {
  const json = JSON.parse(linkString);

  return Link(deserializeType(json.type), json.ends.map(e => ({name: e.name, pointers: e.pointers.map(deserializePointer)})));
}
