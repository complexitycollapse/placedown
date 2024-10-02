import MeshLayer from "./mesh-layer/mesh-layer";
import PersistenceLayer from "./persistence-layer/persistence-layer";

export default function DocumentModel() {
  const obj = {};
  obj.persistenceLayer = PersistenceLayer();
  obj.meshLayer = MeshLayer(obj.persistenceLayer);

  return obj;
}
