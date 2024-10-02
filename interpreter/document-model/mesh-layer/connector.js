export default function Connector(linkPersister, endIndex, pointerIndex, targetMeshpoint) {
  return {
    linkPersister,
    endIndex,
    pointerIndex,
    targetMeshpoint // will be undefined if the meshpoint has not been loaded
  };
}
