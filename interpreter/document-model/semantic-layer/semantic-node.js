import makeObservable from "../observable";

export default function SemanticNode(meshpoint) {
  const obj = {
    meshpoint
  };

  makeObservable(obj);

  return obj;
}