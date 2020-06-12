import { expect } from 'chai';
import {
  extractBbCode,
  extractUntil
} from '../../src/markdown/tokenizer_helpers';

describe('tokenizer_helpers', () => {
  it('extractUntil', () => {
    expect(extractUntil('te1st', 0, '1')).to.eq('te');
    expect(extractUntil('te1st', 1, '1')).to.eq('e');
    expect(extractUntil('te1st', 2, '1')).to.eq(null);

    expect(extractUntil('te1st', 0, 'st')).to.eq('te1');

    expect(extractUntil('te1\nst', 0, 'st')).to.eq(null);

    expect(extractUntil('te1st', 0, '1', 99)).to.eq('te');
    expect(extractUntil('te1st', 0, '1', 1)).to.eq(null);
  });

  it('extractBbCode', () => {
    expect(extractBbCode('test[zxc]qwe', 4)).to.eq('[zxc]');
    expect(extractBbCode('test[zxc]qwe', 1)).to.eq('est[zxc]');

    expect(extractBbCode('test[zxcqwe', 1)).to.eq(null);

    expect(extractBbCode('test[zxc\n]qwe', 1)).to.eq(null);
  });
});
