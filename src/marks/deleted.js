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
}
