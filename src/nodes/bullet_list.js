import { wrappingInputRule } from 'prosemirror-inputrules';

import { Node, nodeIsActive } from '../utils';
import { toggleList } from '../commands';

export default class BulletList extends Node {
  get name() {
    return 'bullet_list';
  }

  get schema() {
    return {
      content: 'list_item+',
      group: 'block',
      attrs: { tight: { default: false } },
      parseDOM: [{
        tag: 'ul',
        getAttrs: dom => ({ tight: dom.hasAttribute('data-tight') })
      }],
      toDOM(node) {
        return [
          'ul',
          { 'data-tight': node.attrs.tight ? 'true' : null, class: 'b-list' },
          0
        ];
      }
    };
  }

  command({ type, schema }) {
    return () => toggleList(type, schema.nodes.list_item);
  }

  activeCheck(type, state) {
    return nodeIsActive(type, state);
  }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*([-+*])\s$/, type)
    ];
  }

  keys({ type, schema }) {
    return {
      'Shift-Ctrl-8': toggleList(type, schema.nodes.list_item)
    };
  }
}
