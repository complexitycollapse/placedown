import makeObservable from "../observable";

export default function Interlinker(key, persister) {
  const obj = {
    key,
    incomming: [],
    persister
  };

  makeObservable(obj);

  return obj;
}
