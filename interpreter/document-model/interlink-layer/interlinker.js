import makeObservable from "../observable";

export default function Interlinker(key, pointer, persister) {
  const obj = {
    key,
    pointer,
    incoming: [],
    outgoing: [],
    persister
  };

  makeObservable(obj);

  return obj;
}
