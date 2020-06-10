import { Mark } from '../base';

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

  get markdownSerializerToken() {
    return {
      open: '[i]',
      close: '[/i]',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
