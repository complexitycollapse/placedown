import { useState } from "react";
import DocumentModel from "../interpreter/document-model/document-model";
import { createSubscriber } from "../common/use-subscriber";
import { SubscribingTreeComponent, SubscribingTreeNodeComponent } from "./subscribing-tree-component.jsx";

export default function PersistenceLayerComponent() {

  const [model] = useState(DocumentModel());

  const subscriber = () => createSubscriber(
    model.persistenceLayer.subscribeToAdd,
    model.persistenceLayer.unsubscribeToAdd,
    () => model.persistenceLayer.objects.map(persister => ({ key: persister.key, persister })));

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
      <SubscribingTreeComponent
        subscriber = { subscriber }
        TreeNodeComponent={ PersisterComponent }>
      </SubscribingTreeComponent>
    </div>
  );
}

function createNode(persister) {
  return {
    label: persister.type + " | " + JSON.stringify(persister.pointer) + "(" + persister.key + ")",
    children: [
      { label: "pointer", value: JSON.stringify(persister.pointer ) },
      { label: "type", value: persister.type },
      { label: "state", value: persister.state },
      { label: "value", value: serializeValue(persister.type, persister.value) }
    ],
    persister
  };
}

function serializeValue(type, value) {
  if (type === "content") {
    return value;
  } else {
    return JSON.stringify(value);
  }
}

function PersisterComponent({ node }) {

  const subscriber = () => createSubscriber(
    node.persister.subscribe,
    node.persister.unsubscribe,
    () => {
      return createNode(node.persister)
    }
  );

  return (<SubscribingTreeNodeComponent
    subscriber = { subscriber }
    >
  </SubscribingTreeNodeComponent>);
}
