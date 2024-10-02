import { getOrSet, ListMap } from "../../../common/utils";
import Type from "./type";

export default function TypeModule(workManager) {

  const undefinedType = new Type(undefined);
  const typeType = new Type("type");

  const obj = {
    types: new Map(),
    requiredMetalinks: new ListMap(),
    onContentLoaded: meshpoint => {
      if (meshpoint.persister.type === "link" || meshpoint.persister.type === "edl") {
        const value = meshpoint.persister.value;
        const rawType = value.type;

        if (rawType === undefined || rawType === null) {
          // Type is blank.
          meshpoint.type = undefinedType;
          workManager.notifyMeshpointReady(meshpoint);

        } else if (typeof rawType === "string") {
          // Type is a string.
          meshpoint.type = getOrSet(obj.types, "string:" + rawType, () => Type(rawType));

          // Is the string "type"? Then this link is a type.
          if (meshpoint.persister.type === "link" && meshpoint.type == typeType) { installNewComplexType(meshpoint); }
          else { 
            workManager.notifyMeshpointReady(meshpoint);
          
            // Is the link a metalink?
            const metalinkDepdenencies = obj.requiredMetalinks(rawType.hashableName);
            obj.requiredMetalinks.remove(rawType.hashableName);
            metalinkDepdenencies.forEach(dependentType => {
              dependentType.requiredMetalinks.remove(rawType.hashableName);
              dependentType.metalinks.push(meshpoint);
              checkIfTypeIsComplete(dependentType);
            });
          }
          
        } else if (rawType.leafType === "link pointer") {
          // Has a link as a type.
          const type = getOrSet(obj.types, rawType.hashableName, () => {
            return Type(rawType);
          });

          workManager.requestLoad(rawType);
          meshpoint.type = type;
          type.instances.push(meshpoint);
          checkIfTypeIsComplete(type);
        } 
      }
    }
  };

  function installNewComplexType(meshpoint) {
    const type = obj.types.get(meshpoint.pointer.hashableName);

    // If the type's meshpoint was already set previously then no need to do it again.
    if (type?.meshpoint) {
      return;
    }

    if (!type) {
      type = Type(meshpoint.pointer, meshpoint);
      obj.types.set(meshpoint.pointer.hashableName, type);
    } else {
      type.meshpoint = meshpoint;
    }

    // Request download of all the metalinks, recording that this type depends on them.
    meshpoint.perister.value.ends.filter(e => e.name === "metalink").forEach(end => {
      end.pointer.filter(p => p.leafType === "link pointer").forEach(metalinkPointer => {
        newType.requiredMetalinks.add(metalinkPointer);
        obj.requiredMetalinks.push(metalinkPointer, type);
        workManager.requestLoad(metalinkPointer);
      });
    });

    checkIfTypeIsComplete(type);
  }

  function checkIfTypeIsComplete(type) {
    if (type.state() === "resolved") {
      workManager.notifyMeshpointReady(type.meshpoint);
      const instances = type.instances;
      type.instances = undefined;
      instances.forEach(instance => workManager.notifyMeshpointReady(instance));
    }
  }

  obj.types.set(undefined, undefinedType);
  obj.types.set("string:type", typeType);

  return obj;
}
