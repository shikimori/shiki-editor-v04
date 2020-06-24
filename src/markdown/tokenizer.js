import Token from './token';
import flatten from 'lodash/flatten';

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
  parseLinkMeta,
  parseQuoteMeta,
  parseSpoilerMeta
} from './bbcode_helpers';

export default class MarkdownTokenizer {
  MAX_BBCODE_SIZE = 512

  BLOCK_BBCODE_REGEXP = /^\[(?:quote|spoiler|code)(?:=(.+?))?\]$/
  DIV_REGEXP = /^\[div(?:(?:=| )([^\]]+))?\]$/
  COLOR_REGEXP = /^\[color=(#[\da-f]+|\w+)\]$/
  SIZE_REGEXP = /^\[size=(\d+)\]$/
  LINK_REGEXP = /^\[url=(.+?)\]$/
  BLOCK_LINK_FEATURE_REGEXP = /\[quote|\[div/
  EMPTY_SPACES_REGEXP = /^ +$/

  MARK_STACK_MAPPINGS = {
    color: '[color]',
    size: '[size]'
  }

  constructor(text, index, nestedSequence = '', exitSequence = undefined) {
    this.text = text;
    this.index = index;

    this.nestedSequence = nestedSequence;
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
      this.parseLine();
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

  parseLine(skippableSequence = '') {
    if (this.isSkippableSequence(skippableSequence || this.nestedSequence)) {
      this.next((skippableSequence || this.nestedSequence).length);
    }

    const startIndex = this.index;
    let match;

    outer: while (this.index <= this.text.length) { // eslint-disable-line no-restricted-syntax
      const { char1, seq2, seq3, seq4, seq5, bbcode } = this;

      const isStart = startIndex === this.index;
      const isEnd = char1 === '\n' || char1 === undefined;

      if (this.isExitSequence) {
        this.finalizeParagraph();
        return;
      }

      if (isEnd) {
        this.finalizeParagraph();
        this.next();
        // add aditional parahraph when meet \n before exitSequesnce
        // if (this.isExitSequence) { this.finalizeParagraph(); }
        return;
      }

      if (isStart) {
        switch (seq2) {
          case '> ':
            this.processBlockQuote(seq2);
            break outer;

          case '- ':
          case '+ ':
          case '* ':
            this.processBulletList(seq2);
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
            return;
          }
        }

        if (bbcode === '[right]') {
          if (this.processBlock('right', bbcode, '[/right]')) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
            return;
          }
        }

        if (seq4 === '[div' && (match = bbcode.match(this.DIV_REGEXP))) {
          const meta = parseDivMeta(match[1]);
          if (this.processBlock('div', bbcode, '[/div]', meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
            return; // TODO: UNCOMMENT AND FIX SPECS
          }
          return;
        }
        if (seq5 === '[spoi' && (match = bbcode.match(this.BLOCK_BBCODE_REGEXP))) {
          const meta = parseSpoilerMeta(match[1]);
          if (this.processBlock('spoiler_block', bbcode, '[/spoiler]', meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
            return;
          }
        }

        if (seq5 === '[code' && (match = bbcode.match(this.BLOCK_BBCODE_REGEXP))) {
          const meta = parseCodeMeta(match[1]);
          if (this.processCodeBlock(bbcode, '[/code]', meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
            return;
          }
        }

        if (seq4 === '[url' && (match = bbcode.match(this.LINK_REGEXP))) {
          const meta = parseLinkMeta(match[1]);
          if (this.processLinkBlock(bbcode, meta)) {
            if (isOnlySpacingsBefore) { this.inlineTokens = []; }
            return;
          }
        }
      }

      if (bbcode) {
        if (seq5 === '[quot' && (match = bbcode.match(this.BLOCK_BBCODE_REGEXP))) {
          if (!isStart) { this.finalizeParagraph(); }
          const meta = parseQuoteMeta(match[1]);
          if (this.processBlock('quote', bbcode, '[/quote]', meta)) {
            return;
          }
        }
      }

      this.processInline(char1, bbcode, seq2, seq3, seq4, seq5);
    }
  }

  processInline(char1, bbcode, seq2, seq3, seq4, seq5) {
    switch (bbcode) {
      case '[b]':
        if (this.processMarkOpen('bold', '[b]', '[/b]')) { return; }
        break;

      case '[/b]':
        if (this.processMarkClose('bold', '[b]', '[/b]')) { return; }
        break;

      case '[i]':
        if (this.processMarkOpen('italic', '[i]', '[/i]')) { return; }
        break;

      case '[/i]':
        if (this.processMarkClose('italic', '[i]', '[/i]')) { return; }
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
        if (this.processMarkClose('link_inline', '[url]', '[/url]')) { return; }
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
        this.finalizeParagraph();
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

    let match;
    let meta;

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
          match = bbcode.match(this.LINK_REGEXP);
          if (!match) { break; }
          meta = parseLinkMeta(match[1]);

          if (this.processLinkInline(bbcode, meta)) { return; }
          break;

        case '[colo':
          match = bbcode.match(this.COLOR_REGEXP);
          if (!match) { break; }

          meta = { color: match[1] };
          if (this.processMarkOpen('color', bbcode, '[/color]', meta)) {
            return;
          }
          break;

        case '[size':
          match = bbcode.match(this.SIZE_REGEXP);
          if (!match) { break; }

          meta = { size: match[1] };
          if (this.processMarkOpen('size', bbcode, '[/size]', meta)) {
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

  processLinkInline(bbcode, attrs) {
    if (!hasInlineSequence(this.text, '[/url]', this.index)) { return false; }

    this.marksStack.push('[url]');
    this.inlineTokens.push(
      this.tagOpen('link_inline', attrs)
    );
    this.next(bbcode.length);
    return true;
  }

  processLinkBlock(bbcode, meta) {
    const isNewLineAhead = this.text[this.index + bbcode.length] === '\n';
    const content = extractUntil(
      this.text,
      '[/url]',
      this.index + bbcode.length,
      null,
      isNewLineAhead
    );
    if (!this.BLOCK_LINK_FEATURE_REGEXP.test(content)) { return false; }

    return this.processBlock('link_block', bbcode, '[/url]', meta);
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

    const tokenizer = new MarkdownTokenizer(
      this.text,
      index,
      this.nestedSequence,
      exitSequence
    );
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

    const tokenizer = new MarkdownTokenizer(
      this.text,
      this.index,
      '',
      exitSequence
    );
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
        this.finalizeParagraph();
      }
    } else {
      slicedTokens = tokens;
    }

    this.index = tokenizer.index;

    // insert new line at the end to maintain original formatting
    if (tokens[tokens.length - 1].type === 'paragraph_close') {
      if (this.text[this.index - 1] === '\n') {
        isNewLineAtEnd = true;
        this.finalizeParagraph();
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

  finalizeParagraph() {
    if (this.nestedSequence && !this.inlineTokens.length) { return; }

    this.push(this.tagOpen('paragraph'));
    this.push(new Token('inline', null, this.inlineTokens));
    this.push(this.tagClose('paragraph'));

    this.inlineTokens = [];
    this.marksStack = [];
  }

  processBlockQuote(tagSequence) {
    let isFirstLine = true;
    this.push(this.tagOpen('blockquote'));
    this.nestedSequence += tagSequence;

    do {
      this.parseLine(isFirstLine ? tagSequence : '');
      isFirstLine = false;
    } while (this.isSequenceContinued());

    this.push(this.tagClose('blockquote'));
    this.nestedSequence = this.nestedSequence
      .slice(0, this.nestedSequence.length - tagSequence.length);
  }

  processBulletList(tagSequence) {
    const priorSequence = this.nestedSequence;

    this.push(this.tagOpen('bullet_list'));
    this.nestedSequence += tagSequence;

    do {
      this.next(tagSequence.length);
      this.push(this.tagOpen('list_item'));
      this.processBulletListLines(priorSequence, '  ');
      this.push(this.tagClose('list_item'));
    } while (this.isSequenceContinued());

    this.push(this.tagClose('bullet_list'));
    this.nestedSequence = this.nestedSequence
      .slice(0, this.nestedSequence.length - tagSequence.length);
  }

  processBulletListLines(priorSequence, tagSequence) {
    const nestedSequenceBackup = this.nestedSequence;

    this.nestedSequence = priorSequence + tagSequence;
    let line = 0;

    do {
      if (line > 0) {
        this.next(this.nestedSequence.length);
      }

      this.parseLine();
      line += 1;
    } while (this.isSequenceContinued());

    this.nestedSequence = nestedSequenceBackup;
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
      this.finalizeParagraph();
    }
  }

  isSequenceContinued() {
    const sequenceSlice = this.text.slice(
      this.index,
      this.index + this.nestedSequence.length
    );

    return sequenceSlice === this.nestedSequence;
  }

  isSkippableSequence(skipSequence) {
    return skipSequence &&
      this.text[this.index] === skipSequence[0] &&
      this.text.slice(this.index, this.index + skipSequence.length) ===
        skipSequence;
  }

  isOnlyInlineSpacingsBefore() {
    return this.inlineTokens.length == 1 &&
      this.inlineTokens[0].type === 'text' &&
      !!this.inlineTokens[0].content.match(this.EMPTY_SPACES_REGEXP);
  }
}
