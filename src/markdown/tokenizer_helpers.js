const MAX_BBCODE_SIZE = 10;

export function extractBbCode(text, startIndex) {
  const sequence = extractUntil(
    text,
    startIndex,
    ']',
    startIndex + MAX_BBCODE_SIZE
  );

  return sequence ? sequence + ']' : null;
}

export function extractUntil(text, startIndex, sequence, maxIndex) {
  for (let i = startIndex + 1; i <= (maxIndex || text.length); i++) {
    const char = text[i];
    const isEnd = char === '\n' || char === undefined;

    if (isEnd) { return null; }
    if (char === sequence[0] && text.slice(i, i + sequence.length) === sequence) {
      return text.slice(startIndex, i);
    }
  }
  return null;
}
