export default function Connector(linkPersister, endIndex, pointerIndex, targetInterlinker) {
  return {
    linkPersister,
    endIndex,
    pointerIndex,
    targetInterlinker // will be undefined if the interlinker has not been loaded
  };
}
