import MeshLayer from "./mesh-layer/mesh-layer";
import PersistenceLayer from "./persistence-layer/persistence-layer";
import SemanticLayer from "./semantic-layer/semantic-layer";

export default function DocumentModel() {
  const obj = {};

  obj.persistenceLayer = PersistenceLayer();
  obj.semanticLayer = SemanticLayer();
  obj.meshLayer = MeshLayer(obj.persistenceLayer, obj.semanticLayer);

  return obj;
}
