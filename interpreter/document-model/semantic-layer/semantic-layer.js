import Layer from "../layer";
import SemanticNode from "./semantic-node";

export default function SemanticLayer() {
  const obj = Layer();
  
  Object.assign(obj, {
    elements: [],
    classes: [],
    onMeshpointsReady: meshpoints => {
      meshpoints.forEach(createNode);
      obj.notify();
    }
  });

  function createNode(meshpoint) {
    obj.elements.push(SemanticNode(meshpoint));
  }

  return obj;
}
