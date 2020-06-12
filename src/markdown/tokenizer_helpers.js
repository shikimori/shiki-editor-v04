const MAX_BBCODE_SIZE = 10;

export function extractBbCode(text, index) {
  for (let i = index + 1; i < index + MAX_BBCODE_SIZE; i++) {
    if (text[i] === ']') {
      return text.slice(index, i + 1);
    }
  }
  return null;
}

