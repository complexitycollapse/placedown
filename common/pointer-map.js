export default function PointerMap() {
  let obj = {
    map: new Map(),
    hasDenoting: pointer => {
      const val = obj.map.get(pointer.hashableName);
      return val?.pointer;
    },
    getDenoting: pointer => {
      const val = obj.map.get(pointer.hashableName);
      return val?.value;
    },
    getDenotingOrSet: (pointer, setter) => {
      const val = obj.map.get(pointer.hashableName);
      return val ? val.value : obj.set(pointer, setter(pointer));
    },
    set: (pointer, value) => {
      const val = obj.map.get(pointer.hashableName);
      if (val) {
        val.value = value;
      } else {
        obj.map.set(pointer.hashableName, { pointer, value});
      }

      return value;
    }
  };

  return Object.freeze(obj);
}
