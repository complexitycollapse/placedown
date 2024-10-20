import makeObservable from "../observable";

export default function SemanticNode(meshpoint) {
  const obj = {
    key: meshpoint.key,
    meshpoint
  };

  makeObservable(obj);

  return obj;
}
