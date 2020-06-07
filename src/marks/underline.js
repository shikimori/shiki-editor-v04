import { Mark } from '../utils';

export default class Underline extends Mark {
  get name() {
    return 'underline';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'u' }],
      toDOM: () => ['u', 0]
    };
  }

  keys({ type }) {
    return {
      'Mod-u': this.command(type)
    };
  }
}
