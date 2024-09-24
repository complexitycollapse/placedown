export default function Span(origin, start, length) {
  return {
    leafType: "span",
    isPointer: true,
    isContent: true,
    origin,
    start,
    length,
    end: start + length,
    sameOrigin: other => other.leafType === obj.leafType && other.origin === obj.origin,
    denotesSame: other => obj.sameOrigin(other) && other.start === obj.start && other.length === obj.length,
    overlaps: other => obj.sameOrigin(other) && overlapping(obj, other)
  };
}

function overlapping(s1, s2) {
  return !(s2.end < s1.start && s1.start < s2.end);
}
