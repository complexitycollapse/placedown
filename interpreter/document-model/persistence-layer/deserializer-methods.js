import LinkPointer from "../../../data-model/link-pointer";
import EdlPointer from "../../../data-model/edl-pointer";
import Span from "../../../data-model/span";
import Parameter from "../../../data-model/parameter";

export function deserializePointer(pointer) {
  if (pointer.leafType === "link pointer") {
    return LinkPointer(pointer.origin);
  } else if (pointer.leafType === "edl pointer") {
    return EdlPointer(pointer.origin);
  } else if (pointer.leafType === "parameter") {
    return Parameter(pointer.value);
  } else if (pointer.leafType === "span") {
    return Span(pointer.origin, pointer.start, pointer.length);
  } else {
    throw new Error("Could not deserialize pointer: " + JSON.stringify(pointer));
  }
}

export function deserializeType(type) {
  return type?.leafType ? deserializePointer(type) : type;
}
