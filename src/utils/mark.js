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

  get view() {
    return null;
  }

  get schema() {
    return null;
  }

  command({ type }) {
    return () => toggleMark(type);
  }

  activeCheck({ type }) {
    return () => markIsActive(type);
  }
}