import useSubscriber from "../common/use-subscriber";
import { createSubscriber } from "../common/use-subscriber";
import { useState } from 'react';

// Node form: key, element, formatter

export function LayerTreeComponent({ layer, elementToNode }) {
  const subscriber = () => createSubscriber(
    layer.subscribeToAdd,
    layer.unsubscribeToAdd,
    () => layer.elements.map(elementToNode));

  const listData = useSubscriber(subscriber);

  return (
    <div>
      <ElementListComponent listData={listData} />
    </div>
  );
}

function ElementListComponent({ listData }) {

  return (
    <ul style={{ paddingLeft: "0.3em", marginLeft: "0.3em" }}>
      {listData.map(node => (
        <ElementNodeComponent key={node.key} node={node} />
      ))}
    </ul>
  );
}

function ElementNodeComponent({ node }) {
  const subscriber = () => createSubscriber(
    node.element.subscribe,
    node.element.unsubscribe,
    () => node.formatter(node.element));

  const { label, value, children } = useSubscriber(subscriber);

  const [showChildren, setShowChildren] = useState(node.expanded);

  const handleClick = () => {
    setShowChildren(!showChildren);
  };

  return (
    <li style={{
      color: "rgb(221, 0, 169)",
      paddingLeft: "0.5em",
      listStyleType: showChildren ? "\"-\"" : "\"+\""
    }}>
      <div onClick={handleClick} style={{ marginBottom: "0.5em" }}>
        <span>{ label }</span>
        {(value || value === 0) && <span style={{ color: "rgb(0, 116, 232)", marginLeft: "1rem" }}>{value}</span>}
      </div>
      {showChildren && children && <ElementListComponent listData={children} />}
    </li>
  );
}
