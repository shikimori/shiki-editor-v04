import { expect } from 'chai';
import {
  parseQuoteMeta,
  parseSpoilerMeta,
  parseDivMeta
} from '../../src/markdown/bbcode_helpers';

describe('tokenizer_helpers', () => {
  it('parseQuoteMeta', () => {
    expect(parseQuoteMeta('')).to.eq(null);

    expect(parseQuoteMeta('qwe')).to.eql({
      nickname: 'qwe'
    });

    expect(parseQuoteMeta('c1;1;qwe')).to.eql({
      comment_id: 1,
      user_id: 1,
      nickname: 'qwe'
    });

    expect(parseQuoteMeta('m1;1;qwe')).to.eql({
      message_id: 1,
      user_id: 1,
      nickname: 'qwe'
    });

    expect(parseQuoteMeta('t1;1;qwe')).to.eql({
      topic_id: 1,
      user_id: 1,
      nickname: 'qwe'
    });

    expect(parseQuoteMeta('zxc;1;qwe')).to.eql({
      user_id: 1,
      nickname: 'qwe'
    });
  });

  it('parseSpoilerMeta', () => {
    expect(parseSpoilerMeta('')).to.eq(null);
    expect(parseSpoilerMeta('qwe')).to.eql({
      label: 'qwe'
    });
  });

  it('parseDivMeta', () => {
    expect(parseDivMeta('')).to.eq(null);
    expect(parseDivMeta('aa bb cc')).to.eql({
      class: 'aa bb cc'
    });
    expect(parseDivMeta('data-a data-b')).to.eql({
      data: [['data-a', ''], ['data-b', '']]
    });
    expect(parseDivMeta('a data-b')).to.eql({
      class: 'a',
      data: [['data-b', '']]
    });
    expect(parseDivMeta('a data-b data-c=d')).to.eql({
      class: 'a',
      data: [['data-b', ''], ['data-c', 'd']]
    });
  });
});

