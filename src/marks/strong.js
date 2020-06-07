import { Mark } from '../utils';

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
      'Mod-b': (state, dispatch) => thisis.command({ type })()(state, dispatch)
    };
  }
}
