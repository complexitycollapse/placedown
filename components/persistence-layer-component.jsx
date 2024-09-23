import { useState } from "react";
import DocumentModel from "../interpreter/document-model/document-model";
import { TreeComponent } from "./tree-component";
import useSubscriber, { createSubscriber } from "../common/use-subscriber";

export default function PersistenceLayerComponent() {

  const [model] = useState(DocumentModel());

  const nodes = useSubscriber(() => createSubscriber(
    model.persistenceLayer.subscribeToAdd,
    model.persistenceLayer.unsubscribeToAdd,
    () => model.persistenceLayer.objects.map(createNodes)));

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
        treeData={ nodes }>
      </TreeComponent>
    </div>
  );
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
