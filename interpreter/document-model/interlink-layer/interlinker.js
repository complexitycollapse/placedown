import makeObservable from "../observable";

export default function Interlinker(key, pointer, persister) {
  const obj = {
    key,
    pointer,
    incomming: [],
    persister,
    onPersisterUpdated: () => undefined
  };

  makeObservable(obj);

  return obj;
}
