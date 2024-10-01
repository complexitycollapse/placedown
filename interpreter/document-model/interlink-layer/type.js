export default function Type(value, interlinker) {
  const obj = {
    key: interlinker.key,
    value,
    interlinker,
    instances: [],
    metalinks: [],
    state: () => {
      if (!obj.interlinker) {
        return "resolved";
      } else if (obj.interlinker.dependencies.has("type")) {
        return "unresolved";
      } else if (obj.interlinker.dependencies.has("metalinks")) {
        return "awaiting metalinks";
      } else {
        return "resolved";
      }
    }
  };

  return obj;
}
