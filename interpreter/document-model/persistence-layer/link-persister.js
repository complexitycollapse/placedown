import Persister from "./persister";
import Link from "../../../data-model/link";
import LinkPointer from "../../../data-model/link-pointer";
import EdlPointer from "../../../data-model/edl-pointer";
import Span from "../../../data-model/span";

export default function LinkPersister(key, initialPointer) {
  const obj = Persister("link", key, initialPointer);
  obj.setValue = value => obj.value = deserialize(value);

  return obj;
}

function deserialize(linkString) {
  const json = JSON.parse(linkString);

  return Link(json.type, json.ends.map(e => ({name: e.name, pointers: e.pointers.map(deserializePointer)})));
}

function deserializePointer(pointer) {
  if (pointer.leafType === "link pointer") {
    return LinkPointer(pointer.origin);
  } else if (pointer.leafType === "edl pointer") {
    return EdlPointer(pointer.origin);
  } else if (pointer.leafType === "span") {
    return Span(pointer.origin, pointer.start, pointer.length);
  } else {
    throw new Error("Could not deserialize pointer: " + JSON.stringify(pointer));
  }
}
