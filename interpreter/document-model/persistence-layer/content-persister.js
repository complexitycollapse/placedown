export default function ContentPersister(key, initialPointer) {
  const obj = {
    key,
    type: "content",
    state: "immutable",
    pointer: initialPointer,
    value: undefined,
    setValue: value => obj.value = value
  };

  return obj;
}
