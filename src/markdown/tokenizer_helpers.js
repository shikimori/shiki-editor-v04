export function extractBbCode(text, startIndex, maxIndex) {
  const sequence = extractUntil(text, ']', startIndex, maxIndex);
  return sequence ? sequence + ']' : null;
}

export function extractUntil(text, sequence, startIndex, maxIndex) {
  for (let i = startIndex + 1; i <= (maxIndex || text.length); i++) {
    const char = text[i];
    const isEnd = char === '\n' || char === undefined;

    if (isEnd) { return null; }
    if (char === sequence[0] && (
      sequence.length === 1 || text.slice(i, i + sequence.length) === sequence
    )) {
      return text.slice(startIndex, i);
    }
  }
  return null;
}

export function hasInlineSequence(text, sequence, startIndex, maxIndex) {
  for (let i = startIndex + 1; i <= (maxIndex || text.length); i++) {
    const char = text[i];
    const isEnd = char === '\n' || char === undefined;

    if (isEnd) { return false; }
    if (char === sequence[0] && (
      sequence.length === 1 || text.slice(i, i + sequence.length) === sequence
    )) {
      return true;
    }
  }
  return false;
}
