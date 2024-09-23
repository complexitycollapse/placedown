import { useState, useSyncExternalStore } from "react";
import DocumentModel from "../interpreter/document-model/document-model";
import TreeComponent from "./tree-component";

export default function PersistenceLayerComponent() {

  const [model] = useState(DocumentModel());
  const [subscriber] = useState(createSubscriber(model));

  useSyncExternalStore(subscriber.subscribe, subscriber.getSnapshot);

  function addHandler() {
    const nameInput = document.getElementById("addPersistenceNode");
    const name = nameInput.value;
    nameInput.value = "";
    model.persistenceLayer.load(JSON.parse(name));
  }

  return (
    <div>
      <h1>Persistence Layer</h1>
      <input type="text" id="addPersistenceNode" defaultValue='{"origin":"content","isContent":true}'></input>
      <input type="button" onClick={addHandler} value="Load"></input>
      <TreeComponent
        treeData={ subscriber.getSnapshot() }>
      </TreeComponent>
    </div>
  );
}

function createSubscriber(model) {
  let snapshot = getNodesSnapshot(model);
  return {
    subscribe: callback => {
      const wrappedCallback =  () => {
        snapshot = getNodesSnapshot(model);
        callback();
      }
      model.persistenceLayer.subscribeToAdd(wrappedCallback);
      return () => model.persistenceLayer.unsubscribeToAdd(wrappedCallback);
    },
    getSnapshot: () => snapshot
  };
}

function getNodesSnapshot(model) {
  return model.persistenceLayer.objects.map(createNodes);
}

function createNodes(persister) {
  return {
    label: persister.key + " | " + JSON.stringify(persister.pointer),
    children: [
      { label: "pointer", value: JSON.stringify(persister.pointer ) },
      { label: "type", value: persister.type },
      { label: "state", value: persister.state },
      { label: "value", value: persister.value }
    ]
  };
}
