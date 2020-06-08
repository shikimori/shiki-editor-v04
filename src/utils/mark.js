// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Utils/Mark.js
import { toggleMark } from 'prosemirror-commands';
import markIsActive from './mark_is_active';
import Extension from './extension';

export default class Mark extends Extension {
  constructor(options = {}) {
    super(options);
  }

  get type() {
    return 'mark';
  }

  get name() {
    return null;
  }

  get view() {
    return null;
  }

  get schema() {
    return null;
  }

  get markdownToken() {
    return { mark: this.name };
  }

  command({ type }) {
    return () => toggleMark(type);
  }

  activeCheck({ type }) {
    return () => markIsActive(type);
  }
}
