import Layer from "../layer";
import Connector from "./connector";
import WorkManager from "./work-manager";
import Meshpoint from "./meshpoint";
import TypeModule from "./type-module";

export default function MeshLayer(persistenceLayer, semanticLayer) {
  const obj = Layer();
  const workManager = WorkManager();
  
  Object.assign(obj, {
    elements: [],
    connectors: [],
    typeModule: TypeModule(workManager),
    workManager,
    load: pointer => {
      const persister = persistenceLayer.load(pointer, onContentLoaded);
      const key = obj.assignId();

      const meshpoint = Meshpoint(key, pointer, persister);
      obj.elements.push(meshpoint);
      obj.notify();
      return meshpoint;
    },
    findByPointer: pointer => obj.elements.filter(e => pointer.overlaps(e.pointer)),
    findOrLoad: pointer => {
      if (!pointer) { throw new Error("Argument error: cannot pass null pointer"); }
      const loaded = obj.findByPointer(pointer);
      return loaded.length === 0 ? [obj.load(pointer)] : loaded;
    }
  });

  function onContentLoaded(persister) {
    // TODO This only checks in one direction. What if the link loaded before the content?

    const affectedMeshpoints = obj.elements.filter(meshpoint => persister.contains(meshpoint.pointer));
    const changedMeshpoints = new Map();
    const newConnectors = [];

    affectedMeshpoints.forEach(meshpoint => obj.typeModule.onContentLoaded(meshpoint));

    affectedMeshpoints.forEach(meshpoint => {
      if (meshpoint.persister.type === "content") {
        return;
      }

      if (meshpoint.persister.type === "link") {
        // Create the outgoing connectors and attach them to the link
        const requiredConnectors = generateConnectors(obj, persister);
          meshpoint.outgoing.push(...requiredConnectors);
          newConnectors.push(...requiredConnectors);
          changedMeshpoints.set(meshpoint.key, meshpoint);
      }
    });

    // Attach the incoming connectors to their targets
    newConnectors.forEach(connector => {
      const target = connector.targetMeshpoint;
      if (target) {
        target.incoming.push(connector);
        changedMeshpoints.set(target.key, target);
      }
    });

    obj.workManager.retrieveLoads().forEach(pointer => obj.findOrLoad(pointer));
    const readyMeshpoints = obj.workManager.retrieveReadyMeshpoints();
    semanticLayer.onMeshpointsReady(readyMeshpoints);

    // Raise all update events
    for (const e of changedMeshpoints.values()) {e.notify(); }
  }

  return obj;
}

function generateConnectors(obj, linkPersister) {
  const connectors = [];
  const link = linkPersister.value;

  link.ends.forEach((e, endIndex) => e.pointers.forEach((p, pointerIndex) => {
    const targets = obj.findByPointer(p);
    connectors.push.apply(connectors, targets.map(target => Connector(linkPersister, endIndex, pointerIndex, target)));
  }));

  return connectors;
}
