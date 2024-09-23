import { removeItem } from "../../common/utils";

export default function makeObservable(obj) {
  obj.dependents = [];
  obj.subscribe = callback => obj.dependents.push(callback);
  obj.unsubscribe = callback => removeItem(obj.dependents, callback);

  return obj;
}