import { ListMap } from "../../../common/utils";
import makeObservable from "../observable";

export default function Meshpoint(key, pointer, persister) {
  const obj = {
    key,
    pointer,
    incoming: [],
    outgoing: [],
    type: undefined,
    dependencies: new ListMap(),
    persister
  };

  makeObservable(obj);

  return obj;
}
