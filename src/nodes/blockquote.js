import { Node, nodeIsActive } from '../utils';
import { toggleWrap } from '../commands';
import { wrappingInputRule } from 'prosemirror-inputrules';

export default class Blockquote extends Node {
  get name() {
    return 'blockquote';
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      parseDOM: [{ tag: 'blockquote' }],
      toDOM() { return ['blockquote', { class: 'b-quote-v2' }, 0]; }
    };
  }

  command({ type, schema }) {
    return () => toggleWrap(type, schema.nodes.paragraph);
  }

  activeCheck({ type }) {
    return () => nodeIsActive(type);
  }

  keys({ type }) {
    return {
      'Ctrl->': toggleWrap(type)
    };
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*>\s$/, type)
    ];
  }
}
