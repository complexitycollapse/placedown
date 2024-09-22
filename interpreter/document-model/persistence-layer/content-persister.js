export default function ContentPersister(initialPointer) {
  const obj = {
    type: "content",
    state: "immutable",
    pointer: initialPointer,
    value: undefined,
    setValue: value => obj.value = value
  };

  return obj;
}
