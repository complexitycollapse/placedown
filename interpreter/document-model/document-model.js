import InterlinkLayer from "./interlink-layer/interlink-layer";
import PersistenceLayer from "./persistence-layer/persistence-layer";

export default function DocumentModel() {
  const obj = {};
  obj.persistenceLayer = PersistenceLayer();
  obj.interlinkLayer = InterlinkLayer(obj.persistenceLayer);

  return obj;
}
