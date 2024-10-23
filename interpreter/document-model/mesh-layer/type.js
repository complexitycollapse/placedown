import makeObservable from "../observable";

export default function Type(value, meshpoint) {
  const obj = {
    value,
    get key() { return obj.meshpoint ? ("m:" + obj.meshpoint.key) : (obj.value ? ("t:" + obj.value) : "undefined"); },
    meshpoint,
    instances: [],
    metalinks: [],
    requiredMetalinks: new Set(),
    state: () => {
      if (obj.value?.leafType === "link pointer") {
        if (!obj.meshpoint?.persister.value) {
          return "unresolved";
        } else if (obj.requiredMetalinks.size > 0) {
          return "awaiting metalinks";
        } else {
          return "resolved";
        }
      }
      
      return "resolved";
    },
    matchesTypeValue: typeValue => 
      obj.value?.leafType === "link pointer" ? obj.value.denotesSame(typeValue) : (typeValue === obj.value)
  };

  makeObservable(obj);

  return obj;
}
