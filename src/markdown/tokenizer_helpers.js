export function extractBbCode(text, startIndex, maxIndex) {
  let bracketsNesting = 0;

  for (let i = startIndex + 1; i <= (maxIndex || text.length); i++) {
    const char = text[i];
    const isEnd = char === '\n' || char === undefined;

    if (isEnd) { return null; }

    if (char === '[') {
      bracketsNesting += 1;
      continue;
    }

    if (char === ']') {
      if (bracketsNesting > 0) {
        bracketsNesting -= 1;
        continue;
      }

      return text.slice(startIndex, i + 1);
    }
  }
  return null;
}

export function extractUntil(text, sequence, startIndex, maxIndex, isIgnoreNewLine) {
  for (let i = startIndex + 1; i <= (maxIndex || text.length); i++) {
    const char = text[i];
    const isEnd = isIgnoreNewLine ?
      (char === undefined) :
      (char === '\n' || char === undefined);

    if (char === sequence[0] && (
      sequence.length === 1 || text.slice(i, i + sequence.length) === sequence
    )) {
      return text.slice(startIndex, i);
    }
    if (isEnd) { return null; }
  }
  return null;
}

export function hasInlineSequence(text, sequence, startIndex, maxIndex) {
  for (let i = startIndex + 1; i <= (maxIndex || text.length); i++) {
    const char = text[i];
    const isEnd = char === '\n' || char === undefined;

    if (char === sequence[0] && (
      sequence.length === 1 || text.slice(i, i + sequence.length) === sequence
    )) {
      return true;
    }
    if (isEnd) { return false; }
  }
  return false;
}

export function extractMarkdownLanguage(text, startIndex) {
  let index = startIndex;

  while (index <= text.length) {
    const isEnd = text[index] === '\n' || text[index] === undefined;

    if (isEnd) {
      return text.slice(startIndex, index);
    }
    index += 1;
  }

  return null;
}

export function rollbackUnclosedMarks(tokens) {
  return tokens;
}
