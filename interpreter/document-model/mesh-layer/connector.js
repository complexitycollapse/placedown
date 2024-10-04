import makeObservable from "../observable";

export default function Connector(linkPersister, endIndex, pointerIndex, targetMeshpoint) {
  const obj = {
    linkPersister,
    endIndex,
    pointerIndex,
    targetMeshpoint // will be undefined if the meshpoint has not been loaded
  };

  makeObservable(obj);

  return obj;
}
