import { useSyncExternalStore } from "react";

export default function useSubscriber(subscriber) {
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
