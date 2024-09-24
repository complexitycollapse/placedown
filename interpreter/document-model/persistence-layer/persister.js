import makeObservable from "../observable";

export default function Persister(type, key, initialOrigin) {
  const obj = {
    key,
    type,
    state: "immutable",
    origin: initialOrigin,
    value: undefined,
    contains: pointer => contains(obj.type, obj.origin, pointer)
  };

  makeObservable(obj);

  return obj;
}

function contains(type, origin, pointer) {
  if (origin !== pointer.origin) {
    return false;
  }

  const persisterType = 
    pointer.leafType === "link pointer" ? "link" 
    : (pointer.leafType === "edl pointer" ? "edl" : "content");

  return persisterType === type;
}
