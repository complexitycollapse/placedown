import { useState, useEffect } from 'react';

/**
 * Represents a list of nodes, intended to either be the children of a parent node
 * or to stand alone as an unordered list.
 * 
 * Nodes have the form { children, label, value? }
 * 
 * @param {Array | Promise} treeData A list of nodes or a promise that returns nodes
 * @returns A component representing a list of nodes
 */
export default function TreeComponent({ treeData }) {

  let [nodeListState, setNodeListState] = useState(undefined);

  useEffect(() => {
    if (Array.isArray(treeData)) {
      setNodeListState(treeData);
    } else {
      treeData(setNodeListState);
    }
  }, []);

  return (
    <ul style={{ paddingLeft: "0.3em", marginLeft: "0.3em" }}>
      {(nodeListState ?? []).map((node) => (
        <TreeNodeComponent key={node.key ?? node.label} node={node} />
      ))}
    </ul>
  );
}

function TreeNodeComponent({ node }) {
  const { children, label, value } = node;

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
        {value && <span style={{ color: "rgb(0, 116, 232)", marginLeft: "1rem" }}>{value}</span>}
      </div>
      {showChildren && children && <TreeComponent treeData={children} />}
    </li>
  );
}