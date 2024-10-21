import { getOrSet, ListMap } from "../../../common/utils";
import Type from "./type";

export default function TypeModule(workManager) {

  const undefinedType = new Type(undefined);
  const typeType = new Type("type");

  const obj = {
    types: new Map(),
    requiredMetalinks: new ListMap(),
    onContentLoaded: meshpoint => {
      if (meshpoint.leafType === "link" || meshpoint.leafType === "edl") {
        processTypeOfLinkOrEdl(meshpoint);

        // Is the link a metalink?
        const hashableName = meshpoint.pointer.hashableName;
        const metalinkDepdenencies = obj.requiredMetalinks.get(hashableName);
        obj.requiredMetalinks.remove(hashableName);
        metalinkDepdenencies.forEach(dependentType => {
          dependentType.requiredMetalinks.delete(hashableName);
          dependentType.metalinks.push(meshpoint);
          checkIfTypeIsComplete(dependentType);
        });
      } else {
        workManager.meshpointTypeReady(meshpoint);
      }
    }
  };

  function processTypeOfLinkOrEdl(meshpoint) {
    const value = meshpoint.persister.value;
    const rawType = value.type;

    if (rawType === undefined || rawType === null) {
      // Type is blank.
      meshpoint.type = undefinedType;
      workManager.meshpointTypeReady(meshpoint);

    } else if (typeof rawType === "string") {
      // Type is a string.
      meshpoint.type = getOrSet(obj.types, "string:" + rawType, () => Type(rawType));

      // Is the string "type"? Then this link is a type.
      if (meshpoint.leafType === "link" && meshpoint.type == typeType) { installNewComplexType(meshpoint); }
      else { 
        workManager.meshpointTypeReady(meshpoint);
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

    meshpoint.notify();
  }

  function installNewComplexType(meshpoint) {
    let type = obj.types.get(meshpoint.pointer.hashableName);

    // If the type's meshpoint was already set previously then no need to do it again.
    // (Why would it not be set? Because we loaded a leaf with this type before the type itself was loaded,
    // so we put a dummy type in the types collection).
    if (type?.meshpoint) {
      return;
    }

    if (!type) {
      type = Type(meshpoint.pointer, meshpoint);
      obj.types.set(meshpoint.pointer.hashableName, type);
    }

    type.meshpoint = meshpoint;

    // Request download of all the metalinks, recording that this type depends on them.
    meshpoint.persister.value.ends.filter(e => e.name === "metalink").forEach(end => {
      end.pointers.filter(p => p.leafType === "link pointer").forEach(metalinkPointer => {
        type.requiredMetalinks.add(metalinkPointer.hashableName);
        obj.requiredMetalinks.push(metalinkPointer.hashableName, type);
        workManager.requestLoad(metalinkPointer);
      });
    });

    checkIfTypeIsComplete(type);
  }

  function checkIfTypeIsComplete(type) {
    if (type.state() === "resolved" && type.instances) {
      workManager.meshpointTypeReady(type.meshpoint);
      type.notify();
      const instances = type.instances;
      type.instances = undefined;
      instances.forEach(instance => {
        workManager.meshpointTypeReady(instance);
        instance.notify();
      });
    }
  }

  obj.types.set(undefined, Object.freeze(undefinedType));
  obj.types.set("string:type", Object.freeze(typeType));

  return obj;
}
