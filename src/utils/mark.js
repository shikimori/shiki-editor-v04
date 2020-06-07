// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Utils/Mark.js
import Extension from './extension';

export default class Mark extends Extension {
  constructor(options = {}) {
    super(options);
  }

  get type() {
    return 'mark';
  }

  get view() {
    return null;
  }

  get schema() {
    return null;
  }

  command() {
    return () => {};
  }
}
