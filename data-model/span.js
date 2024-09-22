export default function Span(origin, start, length) {
  return {
    leafType: "span",
    isPointer: true,
    origin,
    start,
    length
  };
}
