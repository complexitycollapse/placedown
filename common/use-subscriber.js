import { useState, useSyncExternalStore } from "react";

export default function useSubscriber(subscribeFn, unsubscribeFn, getSnapshot) {

  const [subscriber] = useState(createSubscriber(subscribeFn, unsubscribeFn, getSnapshot));

  return useSyncExternalStore(subscriber.subscribe, subscriber.getSnapshot);
}

function createSubscriber(subscribeFn, unsubscribeFn, getSnapshot) {
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
