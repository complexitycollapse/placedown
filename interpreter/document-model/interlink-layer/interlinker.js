import { ListMap } from "../../../common/utils";
import makeObservable from "../observable";

export default function Interlinker(key, pointer, persister) {
  const obj = {
    key,
    pointer,
    incoming: [],
    outgoing: [],
    dependencies: new ListMap(),
    persister
  };

  makeObservable(obj);

  return obj;
}
