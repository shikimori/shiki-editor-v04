import { Mark } from '../base';
import { markInputRule, markPasteRule } from '../commands';

export default class Strong extends Mark {
  get name() {
    return 'strong';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'strong' }],
      toDOM: () => ['strong', 0]
    };
  }

  keys({ type }) {
    return {
      'Mod-b': (state, dispatch) => this.commands({ type })()(state, dispatch)
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)$/, type)
    ];
  }

  pasteRules({ type }) {
    return [
      markPasteRule(/(?:\*\*|__)([^*_]+)(?:\*\*|__)/g, type)
    ];
  }

  get markdownSerializerToken() {
    return {
      open: '[b]',
      close: '[/b]',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
