import { Mark } from '../base';
import { markInputRule, markPasteRule } from '../commands';
import { SpoilerInlineView } from '../node_views';

export default class SpoilerInline extends Mark {
  get name() {
    return 'spoiler_inline';
  }

  get schema() {
    return {
      attrs: {
        isOpened: { default: true }
      },
      parseDOM: [{
        tag: 'span.b-spoiler_inline',
        getAttrs: node => ({
          isOpened: node.classList.contains('is-opened')
        })
      }],
      toDOM: (node) => [
        'span',
        {
          class: `b-spoiler_inline${node.attrs.isOpened ? ' is-opened' : ''}`
        },
        ['span', 0]
      ]
    };
  }

  view(node, view, _inline) {
    return new SpoilerInlineView({ node, view });
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:\|\|)([^|]+)(?:\|\|)$/, type)
    ];
  }

  pasteRules({ type }) {
    return [
      markPasteRule(/(?:\|\|)([^|]+)(?:\|\|)/g, type)
    ];
  }

  get markdownSerializerToken() {
    return {
      open: '||',
      close: '||',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
