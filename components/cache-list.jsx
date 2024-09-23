import getCache from "../auxiliary/cache";
import { TreeComponent } from "./tree-component";

export default function CacheList() {
  return (
  <div>
    <h1>Leaf Cache</h1>
    <TreeComponent
      treeData={setNodeTreeData => getCache().filenames().then(names => setNodeTreeData(names.map(makeNode)))}>
    </TreeComponent>
  </div>);
}

function makeNode(name) {
  return {
    key: name,
    children: setNodeListState => {
      getCache().get(name).then(content => setNodeListState([{ key: "content", label: "content:", value: content}]))
    },
    label: name
  };
}
