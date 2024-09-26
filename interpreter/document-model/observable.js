import { removeItem } from "../../common/utils";

export default function makeObservable(obj) {
  obj.dependants = [];
  obj.subscribe = callback => obj.dependants.push(callback);
  obj.unsubscribe = callback => removeItem(obj.dependants, callback);
  obj.notify = () => obj.dependants.forEach(callback => callback(obj));

  return obj;
}
