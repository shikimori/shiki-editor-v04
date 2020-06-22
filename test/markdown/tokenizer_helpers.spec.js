import { expect } from 'chai';
import {
  extractBbCode,
  extractUntil,
  hasInlineSequence,
  extractMarkdownLanguage
} from '../../src/markdown/tokenizer_helpers';

describe('tokenizer_helpers', () => {
  it('extractBbCode', () => {
    expect(extractBbCode('test[zxc]qwe', 4)).to.eq('[zxc]');
    expect(extractBbCode('test[z[b]x[/b]c]qwe', 4)).to.eq('[z[b]x[/b]c]');
    expect(extractBbCode('test[zxc]qwe', 1)).to.eq(null);

    expect(extractBbCode('test[zxcqwe', 1)).to.eq(null);

    expect(extractBbCode('test[zxc\n]qwe', 1)).to.eq(null);
  });

  it('extractUntil', () => {
    expect(extractUntil('te1st', '1', 0)).to.eq('te');
    expect(extractUntil('te1st', '1', 1)).to.eq('e');
    expect(extractUntil('te1st', '1', 2)).to.eq(null);

    expect(extractUntil('te1st', 'st', 0)).to.eq('te1');

    expect(extractUntil('te1\nst', 'st', 0)).to.eq(null);

    expect(extractUntil('te1st', '1', 0, 99)).to.eq('te');
    expect(extractUntil('te1st', '1', 0, 1)).to.eq(null);
  });

  it('hasInlineSequence', () => {
    expect(hasInlineSequence('te1st', '1', 0)).to.eq(true);
    expect(hasInlineSequence('te1st', '1', 1)).to.eq(true);
    expect(hasInlineSequence('te1st', '1', 2)).to.eq(false);

    expect(hasInlineSequence('te1st', 'st', 0)).to.eq(true);

    expect(hasInlineSequence('te1\nst', 'st', 0)).to.eq(false);

    expect(hasInlineSequence('te1st', '1', 0, 99)).to.eq(true);
    expect(hasInlineSequence('te1st', '1', 0, 1)).to.eq(false);
  });

  it('extractMarkdownLanguage', () => {
    expect(extractMarkdownLanguage('test', 0)).to.eq('test');
    expect(extractMarkdownLanguage('```\n', 3)).to.eq('');
    expect(extractMarkdownLanguage('```test', 3)).to.eq('test');
    expect(extractMarkdownLanguage('```test\n', 3)).to.eq('test');
  });
});
