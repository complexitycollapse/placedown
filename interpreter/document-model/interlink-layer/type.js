export default function Type(value, interlinker) {
  const obj = {
    value,
    interlinker,
    instances: [],
    metalinks: [],
    requiredMetalinks: new Set(),
    state: () => {
      if (obj.value.leafType === "link pointer") {
        if (!obj.interlinker || !obj.interlinker.value) {
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
