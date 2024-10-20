import Persister from "./persister";
import Edl from "../../../data-model/edl";
import { deserializePointer, deserializeType } from "./deserializer-methods";

export default function EdlPersister(key, initialPointer) {
  const obj = Persister("edl", key, initialPointer);
  obj.setValue = value => obj.value = deserialize(value);

  return obj;
}

function deserialize(str) {
  const json = JSON.parse(str);

  return Edl(deserializeType(json.type), json.clips.map(deserializePointer), json.links.map(deserializePointer));
}
