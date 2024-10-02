export default function Type(value, meshpoint) {
  const obj = {
    value,
    meshpoint,
    instances: [],
    metalinks: [],
    requiredMetalinks: new Set(),
    state: () => {
      if (obj.value.leafType === "link pointer") {
        if (!obj.meshpoint || !obj.meshpoint.value) {
          return "unresolved";
        } else if (requiredMetalinks.length > 0) {
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
