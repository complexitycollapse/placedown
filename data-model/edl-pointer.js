export default function EdlPointer(origin) {
  const obj = {
    leafType: "edl pointer",
    isPointer: true,
    origin,
    denotesSame: other => other.leafType === obj.leafType && other.origin === obj.origin
  };

  return obj;
};
