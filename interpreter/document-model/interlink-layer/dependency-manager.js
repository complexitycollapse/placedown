export default function WorkManager() {
  const obj = {
    newWork: new Map(),
    meshpoints: new Set(),
    requestLoad: (pointer) => {
      newWork.set(pointer.hashableName, pointer);
    },
    notifyMeshpointReady: meshpoint => meshpoints.add(meshpoint)
  };

  return obj;
}
