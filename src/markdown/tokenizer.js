import Token from './token';
import flatten from 'lodash/flatten';

import {
  extractBbCode,
  extractUntil,
  hasInlineSequence
} from './tokenizer_helpers';
import { parseQuoteMeta } from './bbcode_helpers';

export default class MarkdownTokenizer {
  SPECIAL_TAGS = {
    paragraph: 'p',
    bullet_list: 'ul',
    list_item: 'li',
    underline: 'span'
  };
  MAX_BBCODE_SIZE = 50; // [quote=...] can be so long
  MAX_URL_SIZE = 512;
  QUOTE_REGEXP = /\[quote(?:=([^\]]+))?\]/;
  SPOILER_REGEXP = /\[spoiler(?:=([^\]]+))?\]/;

  constructor(text, index, exitSequence) {
    this.text = text;
    this.index = index;

    this.exitSequence = exitSequence;
    this.isExitSequence = false;

    this.tokens = [];
    this.inlineTokens = [];
    this.marksStack = [];
  }

  static parse(text) {
    return new MarkdownTokenizer(text, 0, undefined).parse();
  }

  parse() {
    this.index -= 1;
    this.next();

    while (this.index < this.text.length) {
      this.parseLine('');
      if (this.isExitSequence) { break; }
    }

    return flatten(this.tokens);
  }

  next(steps = 1) {
    this.index += steps;
    this.char1 = this.text[this.index];

    if (this.exitSequence) {
      this.isExitSequence = this.char1 === this.exitSequence[0] && (
        this.exitSequence.length === 1 ||
        this.text.slice(this.index, this.index + this.exitSequence.length) ===
          this.exitSequence
      );
    }
  }

  get bbcode() {
    return this.char1 === '[' ?
      extractBbCode(this.text, this.index, this.index + this.MAX_BBCODE_SIZE) :
      null;
  }

  get lastMark() {
    return this.marksStack[this.marksStack.length - 1];
  }

  get seq2() {
    return this.char1 + this.text[this.index + 1];
  }

  get seq3() {
    return this.char1 +
      this.text[this.index + 1] +
      this.text[this.index + 2];
  }

  get seq4() {
    return this.char1 +
      this.text[this.index + 1] +
      this.text[this.index + 2] +
      this.text[this.index + 3];
  }
  get seq5() {
    return this.char1 +
      this.text[this.index + 1] +
      this.text[this.index + 2] +
      this.text[this.index + 3] +
      this.text[this.index + 4];
  }

  parseLine(nestedSequence) {
    const startIndex = this.index;
    let match;

    outer: while (this.index <= this.text.length) { // eslint-disable-line no-restricted-syntax
      const { char1, seq2, seq3, seq5, bbcode } = this;
      const isStart = startIndex === this.index;
      const isEnd = char1 === '\n' || char1 === undefined;

      if (this.isExitSequence) {
        this.processParagraph(startIndex);
        return;
      }

      if (isEnd) {
        this.processParagraph(startIndex);
        this.next();
        return;
      }

      if (isStart) {
        switch (seq2) {
          case '> ':
            this.processBlockQuote(nestedSequence, seq2);
            break outer;

          case '- ':
          case '+ ':
          case '* ':
            this.processBulletList(nestedSequence, seq2);
            break outer;
        }

        switch (seq3) {
          case '```':
            this.processCode(seq3);
            break outer;
        }

        switch (bbcode) {
          case '[*]':
            this.processBulletList(
              nestedSequence,
              this.text[this.index + bbcode.length] === ' ' ?
                bbcode + ' ' :
                bbcode
            );
            break outer;
        }

        if (seq5 === '[spoi' && (match = bbcode.match(this.SPOILER_REGEXP))) {
          this.processBlock(
            'spoiler',
            bbcode,
            '[/spoiler]',
            match[1]
          );
          if (this.char1 === '\n' || this.char1 === undefined) { this.next(); }
          return;
        }
      }

      if (seq5 === '[quot' && ( match = bbcode.match(this.QUOTE_REGEXP))) {
        if (!isStart) {
          this.processParagraph(startIndex);
        }
        this.processBlock(
          'quote',
          bbcode,
          '[/quote]',
          parseQuoteMeta(match[1])
        );
        if (this.char1 === '\n' || this.char1 === undefined) { this.next(); }
        return;
      }

      this.processInline(bbcode);
    }
  }

  processInline() {
    const {
      inlineTokens,
      bbcode,
      char1,
      seq2,
      seq3,
      seq5
    } = this;

    switch (bbcode) {
      case '[b]':
        if (this.processMarkOpen('strong', '[b]', '[/b]')) { return; }
        break;

      case '[/b]':
        if (this.processMarkClose('strong', '[b]', '[/b]')) { return; }
        break;

      case '[i]':
        if (this.processMarkOpen('em', '[i]', '[/i]')) { return; }
        break;

      case '[/i]':
        if (this.processMarkClose('em', '[i]', '[/i]')) { return; }
        break;

      case '[u]':
        if (this.processMarkOpen('underline', '[u]', '[/u]')) { return; }
        break;

      case '[/u]':
        if (this.processMarkClose('underline', '[u]', '[/u]')) { return; }
        break;

      case '[s]':
        if (this.processMarkOpen('deleted', '[s]', '[/s]')) { return; }
        break;

      case '[/s]':
        if (this.processMarkClose('deleted', '[s]', '[/s]')) { return; }
        break;

      case '[/url]':
        if (this.processMarkClose('link', '[url]', '[/url]')) { return; }
        break;

      case '[img]':
        if (this.processInlineImage(bbcode, '[/img]', false)) { return; }
        break;

      case '[poster]':
        if (this.processInlineImage(bbcode, '[/poster]', true)) { return; }
        break;

      default:
        break;
    }

    if (seq2 === '||' && seq3 !== '|||') {
      if (this.lastMark !== seq2) {
        if (this.processMarkOpen('spoiler_inline', '||', '||')) { return; }
      } else {
        if (this.processMarkClose('spoiler_inline', '||', '||')) { return; }
      }
    }

    // if (seq2 === '**' && seq3 !== '***') {
    //   if (this.lastMark !== seq2) {
    //     if (this.processMarkOpen('strong', '**', '**')) { return; }
    //   } else {
    //     if (this.processMarkClose('strong', '**', '**')) { return; }
    //   }
    // }

    if (char1 === '`') {
      if (this.processInlineCode()) { return; }
    }

    // if (char1 == '*' && seq2 !== '**') {
    //   if (this.lastMark !== char1) {
    //     if (this.processMarkOpen('em', '*', '*')) { return; }
    //   } else {
    //     if (this.processMarkClose('em', '*', '*')) { return; }
    //   }
    // }

    if (seq5 === '[url=') {
      if (this.processInlineLink(seq5)) { return; }
    }

    const prevToken = inlineTokens[inlineTokens.length - 1];
    if (!prevToken || prevToken.type !== 'text') {
      inlineTokens.push(new Token('text'));
    }
    const token = inlineTokens[inlineTokens.length - 1];

    token.content = token.content ? token.content + this.char1 : this.char1;
    this.next();
  }

  processMarkOpen(type, openBbcode, closeBbcode) {
    if (!hasInlineSequence(this.text, closeBbcode, this.index)) { return false; }

    this.marksStack.push(openBbcode);
    this.inlineTokens.push(this.tagOpen(type));
    this.next(openBbcode.length);
    return true;
  }

  processMarkClose(type, openBbcode, closeBbcode) {
    if (this.lastMark !== openBbcode) { return false; }

    this.marksStack.pop();
    this.inlineTokens.push(this.tagClose(type));
    this.next(closeBbcode.length);
    return true;
  }

  processInlineCode() {
    let index = this.index + 1;
    let tag = '`';
    let isFirstSymbolPassed = false;
    let startIndex = index;

    while (index <= this.text.length) {
      const char = this.text[index];
      const isEnd = char === '\n' || char === undefined;

      if (!isFirstSymbolPassed) {
        if (char === '`') {
          tag += '`';
        } else {
          startIndex = index;
          isFirstSymbolPassed = true;
          break;
        }
      }

      if (isEnd) {
        return false;
      }

      index += 1;
    }

    const code = extractUntil(this.text, tag, startIndex);
    if (code) {
      this.inlineTokens.push(
        new Token('code_inline', code)
      );
      this.next(code.length + tag.length * 2);
      return true;
    }

    return false;
  }

  processInlineLink(seq) {
    const url = extractUntil(this.text, ']', this.index + seq.length);
    if (url) {
      this.marksStack.push('[url]');
      this.inlineTokens.push(
        this.tagOpen('link', [['href', url]])
      );
      this.next(seq.length + url.length + ']'.length);
      return true;
    }

    return false;
  }

  processInlineImage(tagStart, tagEnd, isPoster) {
    let index = this.index + tagStart.length;

    const src = extractUntil(this.text, tagEnd, index, index + 255);

    if (src) {
      this.inlineTokens.push(
        new Token('image', null, null, [['src', src], ['isPoster', isPoster]])
      );
      this.next(src.length + tagStart.length + tagEnd.length);
      return true;
    }

    return false;
  }

  processBlock(type, startSequence, exitSequence, metaAttributes) {
    this.next(startSequence.length);
    this.push(this.tagOpen(type, metaAttributes));

    if (this.char1 === '\n') { this.next(); }

    const tokenizer = new MarkdownTokenizer(this.text, this.index, exitSequence);
    const tokens = tokenizer.parse();

    this.tokens = this.tokens.concat(tokens);
    this.index = tokenizer.index;

    this.next(exitSequence.length);
    this.push(this.tagClose(type));
  }

  processParagraph(startIndex) {
    const text = this.text.slice(startIndex, this.index);

    this.push(this.tagOpen('paragraph'));
    this.push(new Token('inline', text, this.inlineTokens));
    this.push(this.tagClose('paragraph'));

    this.inlineTokens = [];
    this.marksStack = [];
  }

  processBlockQuote(nestedSequence, tagSequence) {
    const newSequence = nestedSequence + tagSequence;

    this.push(this.tagOpen('blockquote'));

    do {
      this.next(tagSequence.length);
      this.parseLine(newSequence);
    } while (this.isContinued(newSequence));

    this.push(this.tagClose('blockquote'));
  }

  processBulletList(nestedSequence, tagSequence) {
    const newSequence = nestedSequence + tagSequence;

    this.push(this.tagOpen('bullet_list'));

    do {
      this.next(tagSequence.length);
      this.push(this.tagOpen('list_item'));
      this.processBulletListLines(nestedSequence, '  ');
      this.push(this.tagClose('list_item'));
    } while (this.isContinued(newSequence));

    this.push(this.tagClose('bullet_list'));
  }

  processBulletListLines(nestedSequence, tagSequence) {
    const newSequence = nestedSequence + tagSequence;
    let line = 0;

    do {
      if (line > 0) {
        this.next(newSequence.length);
      }

      this.parseLine(newSequence);
      line += 1;
    } while (this.isContinued(newSequence));
  }

  processCode(sequence) {
    this.next(sequence.length);
    const language = this.extractLanguage();
    const startIndex = this.index;
    let isEnded = false;

    while (this.index <= this.text.length) {
      if (this.seq4 === '\n```') {
        this.next(5);
        isEnded = true;
        break;
      }
      this.next();
    }

    const token = new Token(
      'code_block',
      this.text.slice(startIndex, isEnded ? this.index - 5 : this.index),
      null,
      language ? [['language', language]] : null
    );
    this.push(token);
  }

  extractLanguage() {
    const startIndex = this.index;

    while (this.index <= this.text.length) {
      const isEnd = this.char1 === '\n' || this.char1 === undefined;
      this.next();

      if (isEnd) {
        return this.text.slice(startIndex, this.index - 1);
      }
    }

    return null;
  }

  tagOpen(type, attributes = null) {
    return new Token(`${type}_open`, null, null, attributes);
  }

  tagClose(type) {
    return new Token(`${type}_close`);
  }

  push(token) {
    this.tokens.push(token);
  }

  isContinued(sequence) {
    return this.text.slice(this.index, this.index + sequence.length) ===
      sequence;
  }
}
