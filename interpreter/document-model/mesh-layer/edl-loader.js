import makeObservable from "../observable";

export default function EdlLoader(meshpoint) {
  const obj = {
    meshpoint,
    inProgressMeshpoints: new Map(),
    get requirements() {
      return [];
    }
  };

  makeObservable(obj);

  if (!meshpoint.loaded) {
    obj.inProgressMeshpoints.set(meshpoint.key, meshpoint);
  }

  return obj;
}
