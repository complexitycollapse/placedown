import { StrictMode, useState } from 'react'
import CacheListComponent from './cache-list-component';
import { openTab } from '../window/window';
import DocumentModel from '../interpreter/document-model/document-model';
import { LayerTreeComponent, LayerTreePropertyComponent } from './layer-tree-component';
import { DocModelContext } from './contexts';

export default function TabsComponent() {

  const [model] = useState(() => DocumentModel());

  return (
    <StrictMode>
      <DocModelContext.Provider value={model}>
        <div className="button-bar">
        <input type="button" value="Semantics" onClick={() => openTab('semantics-tab')}></input>
        <input type="button" value="Mesh" onClick={() => openTab('mesh-tab')}></input>
        <input type="button" value="Persistence" onClick={() => openTab('persistence-tab')}></input>
        <input type="button" value="Cache" onClick={() => openTab('cache-tab')}></input>
        </div>
        <div id="semantics-tab" className="tab">
          <h1>Semantic Layer</h1>
          <LayerTreeComponent layer={model.semanticLayer} childFormatters={semanticsLayerProperties()}/>
        </div>
        <div id="mesh-tab" className="tab hidden">
          <h1>Mesh Layer</h1>
          <LayerTreeComponent layer={model.meshLayer} childFormatters={meshLayerProperties()}/>
        </div>
        <div id="persistence-tab" className="tab hidden">
          <h1>Persistence Layer</h1>
          <LayerTreePropertyComponent layer={model.persistenceLayer} elementToNode={persisterToNode}/>
        </div>
        <div id="cache-tab" className="tab hidden">
          <CacheListComponent/>
        </div>
      </DocModelContext.Provider>
    </StrictMode>
  );
}

function semanticsLayerProperties() {
  return [
    {property: "elements", formatter: semanticsToNode},
    {property: "classes", formatter: classToNode},
    {property: "semanticTypes", formatter: t => semanticTypeToNode(t, t.meshType.key)}
  ];
};

function semanticsToNode(element) {
  return {
    key: element.meshpoint.key,
    element,
    formatter: node => ({
      label: "node",
      value: node.meshpoint.key,
      children: [
        meshpointToNode(node.meshpoint),
        semanticTypeToNode(node.semanticType)
    ]})
  };
}

function semanticTypeToNode(type, label = "semantic type") {
  return {
    key: label,
    element: type,
    formatter: () => ({
      label,
      children: [
        meshTypeToNode(type.meshType),
        classesToNode(type.classes, type)
      ]
    })
  };
}

function classToNode(klass) {
  return ({
    key: klass.name,
    element: klass,
    formatter: () => ({
      label: klass.name,
      children: []
    })
  });
}

function classesToNode(classArray, element) {
  function classFormatter() {
    return  {
      label: "classes",
      value: "(" + classArray.length + ")",
      children: classArray.map(classToNode)
    };
  }

  return {
    key: "classes",
    element,
    formatter: classFormatter
  };
}

function meshLayerProperties() {
  return [
    {property: "elements", formatter: meshpointToNode},
    {property: "connectors", formatter: connectorToNode}
  ];
};

function meshpointToNode(element) {
  function connectionListFormatter(label) {
    return connections => ({ label, value: " (" + connections[label].length + ")", children: connections[label].map(connectorToNode)});
  }

  if (!element) {
    return { key: "missing meshpoint", element: {}, formatter: () => ({ label: "meshpoint", value: "none"}) };
  }

  return {
    key: element.key,
    element,
    formatter: meshpoint => ({
      label: "meshpoint",
      value: JSON.stringify(meshpoint.pointer) + " (" + meshpoint.key + ")",
      children: [
        property(meshpoint, "pointer", JSON.stringify),
        meshTypeToNode(meshpoint.type),
        property(meshpoint, "persister", p => p.type + " | " + p.origin + " (" + p.key +")"),
        { key: "incoming", element: meshpoint, formatter: connectionListFormatter("incoming")},
        { key: "outgoing", element: meshpoint, formatter: connectionListFormatter("outgoing")}
      ]
    })
  };
}

function meshTypeToNode(type) {
  if (type === undefined) {
   return { key: "mesh type", element: {}, formatter: () => ({ label: "type", value: "unloaded"}) };
  }

  return {
    key: "type",
    element: type,
    formatter: type => ({
      label: "type",
      value: JSON.stringify(type.value),
      children: [
        property(type, "state", f => f()),
        meshpointToNode(type.meshpoint),
        { 
          key: "metalinks", element: type.metalinks, formatter: children => ({
            label: "metalinks",
            value: "(" + children.length + ")",
            children: children.map(meshpointToNode)
          })
        },
        property(type, "requiredMetalinks", m => JSON.stringify(Array.from(m)))
      ]
    })
  };
}

function connectorToNode(connector) {
  return {
    key: connector.linkPersister.origin,
    element: connector,
    formatter: connector => ({
      label: connector.linkPersister.origin,
      children: [
        //property(connector, "persister", () => connector.linkPersister.origin),
        property(connector, "endIndex"),
        property(connector, "pointerIndex"),
        //meshpointToNode(connector.meshpoint)
      ]
    })
  }
}

function persisterToNode(persister) {
  return {
    key: persister.key,
    element: persister,
    formatter: persister => ({
      label: persister.type + " | " + persister.origin + " (" + persister.key + ")",
      children: [
        property(persister, "origin"),
        property(persister, "type"),
        property(persister, "state"),
        property(persister, "value", v => serializeValue(persister.type, v))
      ]
    })
  };
}

function property(obj, prop, formatter = v => v) {
  return {
    key: prop,
    element: obj[prop],
    formatter: v => ({ label: prop, value: formatter(v) })
  };
}

function serializeValue(type, value) {
  if (type === "content") {
    return value;
  } else {
    return JSON.stringify(value);
  }
}
