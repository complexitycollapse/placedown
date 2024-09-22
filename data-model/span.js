export default function Span(origin, start, length) {
  return {
    leafType: "span",
    isPointer: true,
    isContent: true,
    origin,
    start,
    length
  };
}
