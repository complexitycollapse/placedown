import Layer from "../layer";
import SemanticNode from "./semantic-node";
import { attributeType, classType } from "../object-constants";
import { getOrSet } from "../../../common/utils";

export default function SemanticLayer() {
  const obj = Layer();
  
  Object.assign(obj, {
    elements: [],
    classes: new Map(),
    attributes: new Map(),
    onMeshpointsReady: meshpoints => {
      meshpoints.forEach(createNode);
      obj.notify();
    }
  });

  function createNode(meshpoint) {
    const node = SemanticNode(meshpoint);
    obj.elements.push(node);

    if (!node.leafType === "link") {
      return;
    }

    if (attributeType.denotesSame(node.type)) {
      getOrSet(obj.attributes, node.key, () => Attribute(node));
    }

    if (classType.denotesSame(node.type)) {
      getOrSet(obj.classes, node.key, () => Class(node));
    }
  }

  return obj;
}

function Attribute(node) {
  let obj = {
    node
  };

  return obj;
}

function Class(node) {
  let obj = {
    node
  };

  return obj;
}
