import useSubscriber from "../common/use-subscriber";
import { TreeComponent } from "./tree-component";

export function SubscribingTreeComponent({ subscriber, NodeComponent }) {
  const treeData = useSubscriber(subscriber);
  console.log(treeData);

  return (<TreeComponent
    treeData = { treeData ?? [] }>
    NodeComponent = { NodeComponent }
  </TreeComponent>);
}
