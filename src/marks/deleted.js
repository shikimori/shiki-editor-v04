import { Mark } from '../base';

export default class Em extends Mark {
  get name() {
    return 'deleted';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'del' }],
      toDOM: () => ['del', 0]
    };
  }

  get markdownSerializerToken() {
    return {
      open: '[s]',
      close: '[/s]',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
