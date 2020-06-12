const MAX_BBCODE_SIZE = 10;

export function extractBbCode(text, index) {
  for (let i = index + 1; i < index + MAX_BBCODE_SIZE; i++) {
    const char = text[i];
    const isEnd = char === '\n' || char === undefined;

    if (isEnd) { return null; }
    if (char === ']') {
      return text.slice(index, i + 1);
    }
  }
  return null;
}

