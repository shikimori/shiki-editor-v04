import { Mark } from '../utils';

export default class CodeInline extends Mark {
  get name() {
    return 'code_inline';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'code' }],
      toDOM() { return ['code', { class: 'b-code-v2-inline' }]; }
    };
  }
}
