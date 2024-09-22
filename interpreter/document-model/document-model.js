import PersistenceLayer from "./persistence-layer/persistence-layer";

export default function DocumentModel() {
  return {
    persistenceLayer: PersistenceLayer()
  };
}
