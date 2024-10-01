export function arraysShallowEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false; // Arrays have different lengths
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false; // Arrays have different elements
    }
  }

  return true; // Arrays are shallowly equal
}

export function joinPath(...parts) {
  return parts.join("/").replace(/\/+/g, "/");
}

export function removeItem(array, item) {
  const index = array.indexOf(item);
  if (index > -1) {
    array.splice(index, 1); // Removes the item at the found index
  }
}

export function ListMap() {
  let obj = {};
  let table = new Map();

  addProperties(obj, { table });

  function push(key, value) {
    if (table.has(key)) {
      table.get(key).push(value);
    } else {
      table.set(key, [value]);
    }
  }

  function remove(key) {
    table.remove(key);
  }

  function removeItem(key, item) {
    const list = table.get(key);
    removeItem(list, item);
  }

  return finalObject(obj, {
    push,
    get: key => table.get(key) ?? [],
    has: key => table.has(key),
    entries: () => table.entries(),
    values: () => table.values(),
    remove,
    removeItem
  });
}
