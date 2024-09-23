import { useState, useSyncExternalStore } from "react";

export default function useSubscriber(subscriberFn) {
  const [subscriber] = useState(subscriberFn);

  return useSyncExternalStore(subscriber.subscribe, subscriber.getSnapshot);
}

export function createSubscriber(subscribeFn, unsubscribeFn, getSnapshot) {

  let snapshot = getSnapshot();
  return {
    subscribe: callback => {
      const wrappedCallback =  () => {
        snapshot = getSnapshot();
        callback();
      }

      subscribeFn(wrappedCallback);
      return () => unsubscribeFn(wrappedCallback);
    },
    getSnapshot: () => snapshot
  };
}
