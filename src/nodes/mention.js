// based on https://github.com/ueberdosis/tiptap/blob/master/packages/tiptap-extensions/src/nodes/Mention.js
import { Node } from '../base';
import { replaceText } from '../commands';
import { buildSuggestionsPlugin } from '../plugins';

export default class Mention extends Node {
  get name() {
    return 'mention';
  }

  get defaultOptions() {
    return {
      origin: null,
      matcher: {
        char: '@',
        allowSpaces: false,
        startOfLine: false
      }
    };
  }

  // NOTE: node is implemented via link_inline + shiki_inline
  // get schema() {
  //   return {
  //     attrs: {
  //       id: {},
  //       nickname: {}
  //     },
  //     group: 'inline',
  //     inline: true,
  //     selectable: false,
  //     atom: true,
  //     toDOM: node => [
  //       'a',
  //       {
  //         class: 'b-mention',
  //         href: `${this.options.origin}/${node.attrs.nickname}`,
  //         'data-mention-id': node.attrs.id
  //       },
  //       node.attrs.nickname
  //     ],
  //     parseDOM: [
  //       {
  //         tag: 'a[data-mention-id]',
  //         getAttrs: dom => {
  //           const id = dom.getAttribute('data-mention-id');
  //           const nickname = dom.innerText;
  //
  //           return { id, nickname };
  //         }
  //       j
  //     ]
  //   };
  // }
  //
  // commands({ type, _schema }) {
  //   return (attrs, _state) => replaceText(null, type, attrs);
  // }
  //
  // markdownSerialize(state, node) {
  //   state.writeInline(`[user=${node.attrs.id}]`);
  // }

  get plugins() {
    return [
      buildSuggestionsPlugin({
        command: ({ range, attrs, schema }) => replaceText(range, schema.nodes[this.name], attrs),
        appendText: ' ',
        matcher: this.options.matcher,
        items: this.options.items,
        onEnter: this.options.onEnter,
        onChange: this.options.onChange,
        onExit: this.options.onExit,
        onKeyDown: this.options.onKeyDown,
        onFilter: this.options.onFilter
      })
    ];
  }
}
