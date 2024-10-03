export default function Type(value, meshpoint) {
  const obj = {
    value,
    meshpoint,
    instances: [],
    metalinks: [],
    requiredMetalinks: new Set(),
    state: () => {
      if (obj.value?.leafType === "link pointer") {
        if (!obj.meshpoint?.persister?.value) {
          return "unresolved";
        } else if (obj.requiredMetalinks.length > 0) {
          return "awaiting metalinks";
        } else {
          return "resolved";
        }
      }
      
      return "resolved";
    }
  };

  return obj;
}
