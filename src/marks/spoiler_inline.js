import { Mark } from '../base';
import { markInputRule, markPasteRule } from '../commands';

export default class SpoilerInline extends Mark {
  get name() {
    return 'spoiler_inline';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'span.b-spoiler_inline' }],
      toDOM: () => ['span', { class: 'b-spoiler_inline' }]
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:\|\|)([^|]+)(?:\|\|)$/, type)
    ];
  }

  pasteRules({ type }) {
    return [
      markPasteRule(/(?:\|\|)([^|]+)(?:\|\|)/g, type)
    ];
  }

  get markdownSerializerToken() {
    return {
      open: '||',
      close: '||',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
