import { createSubscriber } from "../common/use-subscriber";
import { SubscribingTreeComponent, SubscribingTreeNodeComponent } from "./subscribing-tree-component.jsx";

export default function LayerTreeComponent({ layer, elementToNode }) {
  const subscriber = () => createSubscriber(
    layer.subscribeToAdd,
    layer.unsubscribeToAdd,
    () => layer.elements.map(element => ({ key: element.key, element })));

  function addHandler() {
    const nameInput = document.getElementById("addElement");
    const name = nameInput.value;
    if (name === "") {
      return;
    }
    nameInput.value = "";
    layer.load(JSON.parse(name));
  }

  return (
    <div>
      <input type="text" id="addElement" defaultValue='{"origin":"content","isContent":true}'></input>
      <input type="button" onClick={addHandler} value="Load"></input>
      <SubscribingTreeComponent
        subscriber = { subscriber }
        TreeNodeComponent={ ElementComponent(elementToNode) }
        elementToNode={ elementToNode }>
      </SubscribingTreeComponent>
    </div>
  );
}

function ElementComponent(elementToNode) {
  return ({ node }) => {
    const subscriber = () => createSubscriber(
      node.element.subscribe,
      node.element.unsubscribe,
      () => {
        return elementToNode(node.element)
      }
    );
  
    return (<SubscribingTreeNodeComponent
      subscriber = { subscriber }
      >
    </SubscribingTreeNodeComponent>);
  }
}
