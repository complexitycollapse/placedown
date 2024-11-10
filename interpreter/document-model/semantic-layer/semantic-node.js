import makeObservable from "../observable";

export default function SemanticNode(meshpoint, semanticType) {
  const obj = {
    key: meshpoint.key,
    meshpoint,
    semanticType,
    classes: () => semanticType?.classes ?? []
  };

  makeObservable(obj);

  return obj;
}
