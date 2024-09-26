import Layer from "../layer";
import Connector from "./connector";
import Interlinker from "./interlinker";

export default function InterlinkLayer(persistenceLayer) {
  const obj = Layer()
  
  Object.assign(obj, {
    elements: [],
    connectors: [],
    load: pointer => {
      const persister = persistenceLayer.load(pointer, onContentLoaded);
      const key = obj.assignId();

      const interlinker = Interlinker(key, pointer, persister);
      obj.elements.push(interlinker);
      obj.notify();
      return interlinker;
    },
    findByPointer: pointer => obj.elements.filter(e => pointer.overlaps(e.pointer))
  });

  function onContentLoaded(persister) {
    // TODO This only checks in one direction. What if the link loaded before the content?

    const affectedElements = obj.elements.filter(ilink => persister.contains(ilink.pointer));
    const changedElements = new Map();
    const newConnectors = [];

    affectedElements.forEach(e => {
      if (e.persister.type === "content") {
        return;
      }

      if (e.persister.type === "link") {
      // Create the outgoing connectors and attach them to the link
      const requiredConnectors = generateConnectors(obj, persister);
        e.outgoing.push(...requiredConnectors);
        newConnectors.push(...requiredConnectors);
        changedElements.set(e.key, e);
      }
    });

    // Attach the incoming connectors to their targets
    newConnectors.forEach(connector => {
      const target = connector.targetInterlinker;
      if (target) {
        target.incoming.push(connector);
        changedElements.set(target.key, target);
      }
    });

    // Raise all update events
    for (const e of changedElements.values()) {e.notify(); }
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
