import { StrictMode, useState } from 'react'
import CacheListComponent from './cache-list-component';
import { openTab } from '../window/window';
import DocumentModel from '../interpreter/document-model/document-model';
import LayerTreeComponent from './layer-tree-component';

export default function TabsComponent() {

  const [model] = useState(() => DocumentModel());

  return (
    <StrictMode>
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
    </StrictMode>
  );
}

function interlinkerToNode(element) {
  return {
    label: JSON.stringify(element.persister.pointer) + "(" + element.key + ")",
    children: [
      { label: "pointer", value: JSON.stringify(element.persister.pointer) },
    ],
    element
  };
}

function persisterToNode(persister) {
  return {
    label: persister.type + " | " + JSON.stringify(persister.pointer) + "(" + persister.key + ")",
    children: [
      { label: "pointer", value: JSON.stringify(persister.pointer ) },
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
