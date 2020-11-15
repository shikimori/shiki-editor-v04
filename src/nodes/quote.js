import { Plugin } from 'prosemirror-state';

import { Node } from '../base';
import { serializeAttrs, toDOMInnerQuoteable } from '../utils/quote_helpers';
import { parseQuoteMeta } from '../markdown/tokenizer/bbcode_helpers';

export default class Quote extends Node {
  get name() {
    return 'quote';
  }

  get defaultOptions() {
    return { origin: null };
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      attrs: {
        comment_id: { default: undefined },
        message_id: { default: undefined },
        topic_id: { default: undefined },
        userId: { default: undefined },
        nickname: { default: undefined },
        nFormat: {
          default: {
            nBeforeOpen: true,
            nAfterOpen: true,
            nBeforeClose: true
          }
        }
      },
      parseDOM: [{
        tag: 'div.b-quote',
        getAttrs: node => parseQuoteMeta(node.getAttribute('data-attrs')),
        contentElement: 'div.quote-content'
      }],
      toDOM: node => {
        const innerQuoteable = toDOMInnerQuoteable(node.attrs, this);

        if (innerQuoteable) {
          return [
            'div',
            {
              class: 'b-quote',
              'data-attrs': serializeAttrs(node.attrs)
            },
            ['div', { class: 'quoteable' }, innerQuoteable],
            ['div', { class: 'quote-content' }, 0]
          ];
        }
        return [
          'div',
          {
            class: 'b-quote',
            'data-attrs': serializeAttrs(node.attrs)
          },
          ['div', { class: 'quote-content' }, 0]
        ];
      }
    };
  }

  // hack to prevent getting extra new line before tag
  get plugins() {
    return [
      new Plugin({
        props: {
          transformPastedHTML(html) {
            if (html.includes('data-pm-slice')) { return html; }

            return html.replace(
              /<br[^>]*><div class="b-quote/g,
              '<div class="b-quote'
            );
          }
        }
      })
    ];
  }

  markdownSerialize(state, node) {
    state.renderBlock(
      node,
      'quote',
      serializeAttrs(node.attrs, true),
      node.attrs.nFormat
    );
  }
}
