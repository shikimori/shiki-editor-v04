import Token from '../token';
import { extractUntil } from '../helpers';
import { CACHE, convertToShikiType } from '../../../extensions/shiki_loader';
import { SHIKI_BBCODE_LINK_REGEXP, URL_REGEXP } from './shiki_inline';
import { PSEUDO_BLOCK_TEST_REGEXP } from './inline_or_block';

export default function processShikiBlock(
  state,
  openBbcode,
  closeBbcode,
  meta
) {
  const inlineText = extractUntil(
    state.text,
    closeBbcode,
    state.index + openBbcode.length
  );
  if (inlineText && !PSEUDO_BLOCK_TEST_REGEXP.test(inlineText)) { return; }

  const text = extractUntil(
    state.text,
    closeBbcode,
    state.index + openBbcode.length,
    state.index + openBbcode.length + 10000,
    true
  );

  if (
    !text ||
    SHIKI_BBCODE_LINK_REGEXP.test(text) ||
    URL_REGEXP.test(text)
  ) { return; }

  const nFormat = {
    nBeforeOpen: state.text[state.index - 1] === '\n',
    nAfterOpen: state.text[state.index + openBbcode.length] === '\n',
    nBeforeClose: state.text[state.index + openBbcode.length + text.length - 1] === '\n'
  };

  const sequence = `${openBbcode}${text}${closeBbcode}`;
  const tokens = state.constructor.parse(text.trim());
  const cache = CACHE[convertToShikiType(meta.type)]?.[meta.id];

  if (cache) {
    const attributes = {
      url: cache.url,
      text: cache.text,
      id: meta.id,
      type: meta.type,
      nFormat
    };
    state.push(state.tagOpen('link_block', attributes), true);
    state.tokens = state.tokens.concat(tokens);
    state.push(state.tagClose('link_block'));

  } else {
    state.push(
      new Token('shiki_block', null, tokens, {
        type: meta.type,
        id: meta.id,
        bbcode: sequence,
        openBbcode,
        closeBbcode,
        isLoading: cache === undefined,
        isNotFound: cache === null,
        nFormat
      })
    );
  }

  state.next(sequence.length, true);
  return true;
}
