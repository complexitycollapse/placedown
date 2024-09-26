import { StrictMode, useState } from 'react'
import CacheListComponent from './cache-list-component';
import { openTab } from '../window/window';
import DocumentModel from '../interpreter/document-model/document-model';
import LayerTreeComponent from './layer-tree-component';
import { DocModelContext } from './contexts';

export default function TabsComponent() {

  const [model] = useState(() => DocumentModel());

  return (
    <StrictMode>
      <DocModelContext.Provider value={model}>
        <div className="button-bar">
        <input type="button" value="Interlink" onClick={() => openTab('interlink-tab')}></input>
        <input type="button" value="Persistence" onClick={() => openTab('persistence-tab')}></input>
        <input type="button" value="Cache" onClick={() => openTab('cache-tab')}></input>
        </div>
        <div id="interlink-tab" className="tab">
          <h1>Interlink Layer</h1>
          <LayerTreeComponent layer={model.interlinkLayer} elementToNode={interlinkerToNode}/>
        </div>
        <div id="persistence-tab" className="tab hidden">
          <h1>Persistence Layer</h1>
          <LayerTreeComponent layer={model.persistenceLayer} elementToNode={persisterToNode}/>
        </div>
        <div id="cache-tab" className="tab hidden">
          <CacheListComponent/>
        </div>
      </DocModelContext.Provider>
    </StrictMode>
  );
}

function interlinkerToNode(element) {
  return {
    label: JSON.stringify(element.pointer) + " (" + element.key + ")",
    children: [
      { label: "pointer", value: JSON.stringify(element.pointer) },
      { label: "persister", value: element.persister.type + " | " + element.persister.origin + " (" + element.persister.key + ")" },
      { label: "incoming", value: " (count: " + element.incoming.length + ")", children: element.incoming.map(connectorToNode)},
      { label: "outgoing", value: " (count: " + element.outgoing.length + ")", children: element.outgoing.map(connectorToNode)}
    ],
    element
  };
}

function connectorToNode(connector) {
  const ilink = connector.targetInterlinker;
  return {
    label: JSON.stringify(connector.linkPersister.origin),
    children: [
      { label: "persister", value: persisterToNode(connector.linkPersister) },
      { label: "endIndex", value: connector.endIndex },
      { label: "pointerIndex", value: connector.pointerIndex },
      { label: "target interlinker", value: ilink ? (JSON.stringify(ilink.pointer) + " (" + ilink.key + ")") : "unloaded" }
    ]};
}

function persisterToNode(persister) {
  return {
    label: persister.type + " | " + persister.origin + " (" + persister.key + ")",
    children: [
      { label: "origin", value: persister.origin },
      { label: "type", value: persister.type },
      { label: "state", value: persister.state },
      { label: "value", value: serializeValue(persister.type, persister.value) }
    ],
    persister
  };
}

function serializeValue(type, value) {
  if (type === "content") {
    return value;
  } else {
    return JSON.stringify(value);
  }
}
