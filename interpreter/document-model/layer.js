import { removeItem } from "../../common/utils";

export default function Layer() {
  const subscriptions = [];
  let unique = 0;

  const obj = {
    subscribeToAdd: callback => subscriptions.push(callback),
    unsubscribeToAdd: callback => removeItem(subscriptions, callback),
    assignId: () => (++unique).toString(),
    notifyObservers: () => {
      for (const callback of subscriptions) { callback(); }
    }
  }

  return obj;
}
