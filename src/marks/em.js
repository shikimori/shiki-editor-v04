import { Mark } from '../base';
import { markInputRule, markPasteRule } from '../commands';

export default class Em extends Mark {
  get name() {
    return 'em';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'em' }],
      toDOM: () => ['em', 0]
    };
  }

  keys({ type }) {
    return {
      'Mod-i': (state, dispatch) => this.commands({ type })()(state, dispatch)
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:^|[^_])(_([^_]+)_)$/, type),
      markInputRule(/(?:^|[^*])(\*([^*]+)\*)$/, type)
    ];
  }

  pasteRules({ type }) {
    return [
      markPasteRule(/_([^_]+)_/g, type),
      markPasteRule(/\*([^*]+)\*/g, type)
    ];
  }

  get markdownSerializerToken() {
    return {
      open: '*',
      close: '*',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
