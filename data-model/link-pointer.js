export default function LinkPointer(origin) {
  return {
    leafType: "link pointer",
    isPointer: true,
    origin,
    denotesSame: other => other.leafType === obj.leafType && other.origin === obj.origin,
    overlaps: other => obj.denotesSame(other)
  };
};
