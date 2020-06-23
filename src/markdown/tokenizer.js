import Token from './token';
import flatten from 'lodash/flatten';

import { fixUrl } from '../utils';
import {
  extractBbCode,
  extractUntil,
  hasInlineSequence,
  extractMarkdownLanguage
} from './tokenizer_helpers';
import {
  parseCodeMeta,
  parseDivMeta,
  parseImageMeta,
  parseQuoteMeta,
  parseSpoilerMeta
} from './bbcode_helpers';

export default class MarkdownTokenizer {
  MAX_BBCODE_SIZE = 250 // [quote=...] can be so long... spoiler too...
  MAX_URL_SIZE = 512

  BLOCK_BBCODE_REGEXP = /^\[(?:quote|spoiler|code)(?:=(.+?))?\]$/
  DIV_REGEXP = /^\[div(?:(?:=| )([^\]]+))?\]$/
  COLOR_REGEXP = /^\[color=(#[\da-f]+|\w+)\]$/
  SIZE_REGEXP = /^\[size=(\d+)\]$/
  EMPTY_SPACES_REGEXP = /^ +$/

  MARK_STACK_MAPPINGS = {
    color: '[color]',
    size: '[size]'
  }

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
    return new MarkdownTokenizer(text, 0).parse();
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

  next(steps = 1, isSkipNewLine = false) {
    this.index += steps;
    this.char1 = this.text[this.index];

    if (this.exitSequence) {
      this.isExitSequence = this.char1 === this.exitSequence[0] && (
        this.exitSequence.length === 1 ||
        this.text.slice(this.index, this.index + this.exitSequence.length) ===
          this.exitSequence
      );
    }

    if (isSkipNewLine && (this.char1 === '\n' || this.char1 === undefined)) {
      this.next();
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
      const { char1, seq2, seq3, seq4, seq5, bbcode } = this;

      const isStart = startIndex === this.index;
      const isEnd = char1 === '\n' || char1 === undefined;

      if (this.isExitSequence) {
        this.processParagraph();
        return;
      }

      if (isEnd) {
        this.processParagraph();
        this.next();
        // add aditional parahraph when meet \n before exitSequesnce
        // if (this.isExitSequence) { this.processParagraph(); }
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
            this.processCodeBlock(seq3, '\n```');
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
      }

      const isOnlySpacingsBefore = this.isOnlyInlineSpacingsBefore();

      if (bbcode && (isStart || isOnlySpacingsBefore)) {
        if (bbcode === '[center]') {
          if (this.processBlock('center', bbcode, '[/center]')) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
          }
          return;
        }

        if (bbcode === '[right]') {
          if (this.processBlock('right', bbcode, '[/right]')) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
          }
          return;
        }

        if (seq4 === '[div' && (match = bbcode.match(this.DIV_REGEXP))) {
          const meta = parseDivMeta(match[1]);
          if (this.processBlock('div', bbcode, '[/div]', meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
          }
          return;
        }
        if (seq5 === '[spoi' && (match = bbcode.match(this.BLOCK_BBCODE_REGEXP))) {
          const meta = parseSpoilerMeta(match[1]);
          if (this.processBlock('spoiler_block', bbcode, '[/spoiler]', meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
          }
          return;
        }

        if (seq5 === '[code' && (match = bbcode.match(this.BLOCK_BBCODE_REGEXP))) {
          const meta = parseCodeMeta(match[1]);
          if (this.processCodeBlock(bbcode, '[/code]', meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
          }
          return;
        }
      }

      if (bbcode) {
        if (seq5 === '[quot' && (match = bbcode.match(this.BLOCK_BBCODE_REGEXP))) {
          if (!isStart) { this.processParagraph(); }
          const meta = parseQuoteMeta(match[1]);
          this.processBlock('quote', bbcode, '[/quote]', meta);
          return;
        }
      }

      this.processInline(char1, bbcode, seq2, seq3, seq4, seq5);
    }
  }

  processInline(char1, bbcode, seq2, seq3, seq4, seq5) {
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

      case '[/color]':
        if (this.processMarkClose('color', '[color]', '[/color]')) { return; }
        break;

      case '[/size]':
        if (this.processMarkClose('size', '[size]', '[/size]')) { return; }
        break;

      case '[poster]':
        if (this.processInlineImage(bbcode, '[/poster]', true)) { return; }
        break;

      case '[code]':
        if (this.processInlineCode(bbcode, '[/code]')) { return; }
        break;

      case '[hr]':
        this.processHr(bbcode);
        return;

      case '[br]':
        this.next(bbcode.length);
        this.processParagraph();
        return;

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

    if (char1 === '`') {
      if (this.processInlineCode(char1)) { return; }
    }

    let meta;
    let attrs;

    if (bbcode) {
      switch (seq4) {
        case '[div':
          this.processInlineBlock(bbcode, '[/div]');
          return;

        case '[img':
          meta = parseImageMeta(bbcode.slice(4, bbcode.length - 1).trim());
          if (this.processInlineImage(bbcode, '[/img]', false, meta)) {
            return;
          }
          break;
      }

      switch (seq5) {
        case '[url=':
          if (this.processInlineLink(seq5)) { return; }
          break;

        case '[colo':
          meta = bbcode.match(this.COLOR_REGEXP);
          attrs = meta ? { color: meta[1] } : null;
          if (attrs &&
             this.processMarkOpen('color', bbcode, '[/color]', attrs)) {
            return;
          }
          break;

        case '[size':
          meta = bbcode.match(this.SIZE_REGEXP);
          attrs = meta ? { size: meta[1] } : null;
          if (attrs &&
             this.processMarkOpen('size', bbcode, '[/size]', attrs)) {
            return;
          }
          break;
      }
    }

    this.appendInlineContent(char1);
  }

  processMarkOpen(type, openBbcode, closeBbcode, attributes) {
    if (!hasInlineSequence(this.text, closeBbcode, this.index)) { return false; }

    this.marksStack.push(this.MARK_STACK_MAPPINGS[type] || openBbcode);
    this.inlineTokens.push(this.tagOpen(type, attributes));
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

  processInlineCode(startSequence, endSequence) {
    if (!endSequence) {
      let index = this.index + 1;
      let tag = startSequence;
      let isFirstSymbolPassed = false;

      while (index <= this.text.length) {
        const char = this.text[index];
        const isEnd = char === '\n' || char === undefined;

        if (!isFirstSymbolPassed) {
          if (char === '`') {
            tag += '`';
          } else {
            isFirstSymbolPassed = true;
            break;
          }
        }

        if (isEnd) {
          return false;
        }

        index += 1;
      }
      startSequence = tag; // eslint-disable-line no-param-reassign
      endSequence = tag; // eslint-disable-line no-param-reassign
    }

    const startIndex = this.index + startSequence.length;
    const code = extractUntil(this.text, endSequence, startIndex);
    if (code) {
      this.inlineTokens.push(
        new Token('code_inline', code)
      );
      this.next(code.length + startSequence.length + endSequence.length);
      return true;
    }

    return false;
  }

  processInlineLink(seq) {
    const url = extractUntil(this.text, ']', this.index + seq.length);
    if (url) {
      this.marksStack.push('[url]');
      this.inlineTokens.push(
        this.tagOpen('link', [['href', fixUrl(url)]])
      );
      this.next(seq.length + url.length + ']'.length);
      return true;
    }

    return false;
  }

  processInlineImage(tagStart, tagEnd, isPoster, metaAttributes) {
    let index = this.index + tagStart.length;

    const src = extractUntil(this.text, tagEnd, index, index + 255);

    if (src) {
      this.inlineTokens.push(
        new Token(
          'image',
          null,
          null,
          {
            src,
            isPoster,
            ...(metaAttributes || {})
          }
        )
      );
      this.next(src.length + tagStart.length + tagEnd.length);
      return true;
    }

    return false;
  }

  processBlock(type, startSequence, exitSequence, metaAttributes) {
    let index = this.index + startSequence.length;
    if (this.text[index] === '\n') { index += 1; }

    const tokenizer = new MarkdownTokenizer(this.text, index, exitSequence);
    const tokens = tokenizer.parse();

    const endSequence =
      this.text.slice(tokenizer.index, tokenizer.index + exitSequence.length);

    if (endSequence !== exitSequence) {
      this.appendInlineContent(startSequence);
      return false;
    }

    this.next(startSequence.length);
    this.push(this.tagOpen(type, metaAttributes), true);

    this.tokens = this.tokens.concat(tokens);
    this.index = tokenizer.index;

    this.next(exitSequence.length, true);
    this.push(this.tagClose(type));

    return true;
  }

  processInlineBlock(startSequence, exitSequence) {
    this.appendInlineContent(startSequence);

    const tokenizer = new MarkdownTokenizer(this.text, this.index, exitSequence);
    const tokens = tokenizer.parse();

    const endSequence =
      this.text.slice(tokenizer.index, tokenizer.index + exitSequence.length);

    if (endSequence !== exitSequence) { return false; }

    let slicedTokens;
    let isNewLineAtEnd = false;

    // append first paragraph to current inlineTokens
    if (tokens[0].type === 'paragraph_open') {
      tokens[1].children.forEach(token => {
        if (token.type === 'text') {
          this.appendInlineContent(token.content, false);
        } else {
          this.inlineTokens.push(token);
        }
      });
      slicedTokens = tokens.slice(3);
      // close parahraph after prior content was joined
      if (slicedTokens.length) {
        this.processParagraph();
      }
    } else {
      slicedTokens = tokens;
    }

    this.index = tokenizer.index;

    // insert new line at the end to maintain original formatting
    if (tokens[tokens.length - 1].type === 'paragraph_close') {
      if (this.text[this.index - 1] === '\n') {
        isNewLineAtEnd = true;
        this.processParagraph();
      }
    }

    // unwrap final paragraph
    if (!isNewLineAtEnd && slicedTokens.length &&
      slicedTokens[slicedTokens.length - 1].type === 'paragraph_close'
    ) {
      this.inlineTokens = slicedTokens[slicedTokens.length - 2].children;
      slicedTokens = slicedTokens.slice(0, slicedTokens.length - 3);
    }

    this.tokens = [...this.tokens, ...slicedTokens];

    this.appendInlineContent(exitSequence);

    return true;
  }

  processParagraph() {
    this.push(this.tagOpen('paragraph'));
    this.push(new Token('inline', null, this.inlineTokens));
    this.push(this.tagClose('paragraph'));

    this.inlineTokens = [];
    this.marksStack = [];
  }

  processBlockQuote(nestedSequence, tagSequence) {
    const newSequence = nestedSequence + tagSequence;
    let isFirstLine = true;

    this.push(this.tagOpen('blockquote'));

    do {
      this.next(isFirstLine ? tagSequence.length : newSequence.length);
      this.parseLine(newSequence);
      isFirstLine = false;
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

  processCodeBlock(startSequence, endSequence, meta) {
    const isMarkdown = startSequence === '```';
    let index = this.index + startSequence.length;
    let language;

    if (isMarkdown) {
      language = extractMarkdownLanguage(this.text, index);
      index += language ? language.length + 1 : 1;
    } else {
      if (meta && meta.language) {
        language = meta.language;
      }
      if (this.text[index] === '\n') {
        index += 1;
      }
    }

    const startIndex = index;
    let isEnded = false;

    while (index <= this.text.length) {
      if (this.text[index] === endSequence[0] &&
        this.text.slice(index, index + endSequence.length) === endSequence
      ) {
        isEnded = true;
        break;
      }
      index += 1;
    }
    if (!isEnded) {
      this.appendInlineContent(startSequence + language);
      return false;
    }

    const endIndex = isMarkdown ?
      index :
      this.text[index - 1] === '\n' ? index - 1 : index;
    const text = this.text.slice(startIndex, endIndex);
    const languageAttr = language ? [['language', language]] : null;
    index += endSequence.length;

    this.push(new Token('code_block', text, null, languageAttr));
    this.next(index - this.index, true);
  }

  processHr(bbcode) {
    this.ensureParagraphClosed();
    this.next(bbcode.length, true);
    this.push(new Token('hr', null, null, null));
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

  appendInlineContent(sequence, isMoveNext = true) {
    const prevToken = this.inlineTokens[this.inlineTokens.length - 1];
    if (!prevToken || prevToken.type !== 'text') {
      this.inlineTokens.push(new Token('text'));
    }
    const token = this.inlineTokens[this.inlineTokens.length - 1];
    token.content = token.content ? token.content + sequence : sequence;

    if (isMoveNext) {
      this.next(sequence.length);
    }
  }

  ensureParagraphClosed() {
    if (this.inlineTokens.length) {
      this.processParagraph();
    }
  }

  isContinued(sequence) {
    return this.text.slice(this.index, this.index + sequence.length) ===
      sequence;
  }

  isOnlyInlineSpacingsBefore() {
    return this.inlineTokens.length == 1 &&
      this.inlineTokens[0].type === 'text' &&
      !!this.inlineTokens[0].content.match(this.EMPTY_SPACES_REGEXP);
  }
}
