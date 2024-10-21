import Layer from "../layer";
import SemanticNode from "./semantic-node";
import { attributeTypePointer, classTypePointer } from "../object-constants";
import { getOrSet } from "../../../common/utils";

export default function SemanticLayer() {
  const obj = Layer();
  
  Object.assign(obj, {
    elements: [],
    classes: new Map(),
    attributes: new Map(),
    semanticTypes: new Map(),
    onMeshpointsReady: meshpoints => {
      meshpoints.forEach(createNode);
      obj.notify();
    }
  });

  function createNode(meshpoint) {
    const semanticType = getOrSet(obj.semanticTypes, meshpoint.type.key, () => {
      var classesForType = [];
      meshpoint.type.metalinks.forEach(metaMesh => {
        if (isClass(metaMesh)) {
          classesForType.push(getOrSet(obj.classes, metaMesh.key, () => Class(metaMesh)));
        }
      });
      return SemanticType(meshpoint.type, classesForType);
    });

    const node = SemanticNode(meshpoint, semanticType);
    obj.elements.push(node);

    if (isAttribute(meshpoint)) {
      getOrSet(obj.attributes, meshpoint.key, () => Attribute(meshpoint));
    }

    if (isClass(meshpoint))  {
      getOrSet(obj.classes, meshpoint.key, () => Class(meshpoint));
    }
  }

  return obj;
}

function isClass(meshpoint) {
  return meshpoint.leafType === "link" && meshpoint.type.matchesTypeValue(classTypePointer);
}

function isAttribute(meshpoint) {
  return meshpoint.leafType === "link" && meshpoint.type.matchesTypeValue(attributeTypePointer);
}

function Attribute(meshpoint) {
  let obj = {
    meshpoint
  };

  return obj;
}

function Class(meshpoint) {
  let obj = {
    get name() { return meshpoint.persister.parameterValue("name"); },
    meshpoint
  };

  return obj;
}

function SemanticType(meshType, classes) {
  let obj = {
    meshType,
    classes
  };

  return obj;
}
