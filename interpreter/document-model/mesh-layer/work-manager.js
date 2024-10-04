export default function WorkManager() {
  const obj = {
    newLoads: new Map(),
    readyMeshpoints: new Set(),
    requestLoad: (pointer) => {
      obj.newLoads.set(pointer.hashableName, pointer);
    },
    retrieveLoads() {
      const loads = [...obj.newLoads.values()];
      obj.newLoads.clear();
      return loads;
    },
    meshpointTypeReady: meshpoint => obj.readyMeshpoints.add(meshpoint),
    retrieveReadyMeshpoints() {
      const meshpoints = Array.from(obj.readyMeshpoints);
      obj.readyMeshpoints.clear();
      return meshpoints;
    }
  };

  return obj;
}
