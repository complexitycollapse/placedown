import { getOrSet, ListMap } from "../../../common/utils";
import Type from "./type";

export default function TypeModule(workManager) {

  const undefinedType = new Type(undefined);
  const typeType = new Type("type");

  const obj = {
    types: new Map(),
    requiredMetalinks: new ListMap(),
    onContentLoaded: ilink => {
      if (ilink.persister.type === "link" || ilink.persister.type === "edl") {
        const value = ilink.persister.value;
        const rawType = value.type;

        if (rawType === undefined || rawType === null) {
          // Type is blank.
          ilink.type = undefinedType;
          workManager.notifyMeshpointReady(ilink);

        } else if (typeof rawType === "string") {
          // Type is a string.
          ilink.type = getOrSet(obj.types, "string:" + rawType, () => Type(rawType));

          // Is the string "type"? Then this link is a type.
          if (ilink.persister.type === "link" && ilink.type == typeType) { installNewComplexType(ilink); }
          else { 
            workManager.notifyMeshpointReady(ilink);
          
            // Is the link a metalink?
            const metalinkDepdenencies = obj.requiredMetalinks(rawType.hashableName);
            obj.requiredMetalinks.remove(rawType.hashableName);
            metalinkDepdenencies.forEach(dependentType => {
              dependentType.requiredMetalinks.remove(rawType.hashableName);
              dependentType.metalinks.push(ilink);
              checkIfTypeIsComplete(dependentType);
            });
          }
          
        } else if (rawType.leafType === "link pointer") {
          // Has a link as a type.
          const type = getOrSet(obj.types, rawType.hashableName, () => {
            return Type(rawType);
          });

          workManager.requestLoad(rawType);
          ilink.type = type;
          type.instances.push(ilink);
          checkIfTypeIsComplete(type);
        } 
      }
    }
  };

  function installNewComplexType(ilink) {
    const type = obj.types.get(ilink.pointer.hashableName);

    // If the type's meshpoint was already set previously then no need to do it again.
    if (type?.ilink) {
      return;
    }

    if (!type) {
      type = Type(ilink.pointer, ilink);
      obj.types.set(ilink.pointer.hashableName, type);
    } else {
      type.interlinker = ilink;
    }

    // Request download of all the metalinks, recording that this type depends on them.
    ilink.perister.value.ends.filter(e => e.name === "metalink").forEach(end => {
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
      workManager.notifyMeshpointReady(type.interlinker);
      const instances = type.instances;
      type.instances = undefined;
      instances.forEach(instance => workManager.notifyMeshpointReady(instance));
    }
  }

  obj.types.set(undefined, undefinedType);
  obj.types.set("string:type", typeType);

  return obj;
}
