export default function Span(origin, start, length) {
  return {
    leafType: "span",
    isPointer: true,
    isContent: true,
    origin,
    start,
    length,
    denotesSame: other => other.leafType === obj.leafType && other.origin === obj.origin
      && other.start === obj.start && other.length === obj.length
  };
}
