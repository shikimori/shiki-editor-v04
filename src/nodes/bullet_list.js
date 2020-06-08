import Node from '../utils/node';
import { wrappingInputRule } from 'prosemirror-inputrules';

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

  get markdownToken() {
    return { block: 'bullet_list' };
  }

  // commands({ type, schema }) {
  //   return () => toggleList(type, schema.nodes.list_item);
  // }

  // keys({ type, schema }) {
  //   return {
  //     'Shift-Ctrl-8': toggleList(type, schema.nodes.list_item)
  //   };
  // }

  inputRules({ type }) {
    return [
      wrappingInputRule(/^\s*([-+*])\s$/, type)
    ];
  }
}
