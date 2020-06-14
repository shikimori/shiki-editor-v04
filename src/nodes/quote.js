import { Node } from '../base';

export default class Quote extends Node {
  get name() {
    return 'quote';
  }

  get schema() {
    const prependBaseUrl = this.prependBaseUrl.bind(this);

    return {
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      attrs: {
        comment_id: { default: undefined },
        message_id: { default: undefined },
        topic_id: { default: undefined },
        user_id: { default: undefined },
        nickname: { default: undefined }
      },
      parseDOM: [{
        tag: 'div.b-quote',
        getAttrs: node => ({
          comment_id: node.getAttribute('data-comment_id'),
          message_id: node.getAttribute('data-message_id'),
          topic_id: node.getAttribute('data-topic_id'),
          user_id: node.getAttribute('data-user_id'),
          nickname: node.getAttribute('data-nickname')
        })
      }],
      toDOM(node) {
        if (node.attrs.nickname) {
          let innerQuoteable;

          if (node.attrs.comment_id || node.attrs.message_id ||
            node.attrs.topic_id
          ) {
            let href;

            if (node.attrs.comment_id) {
              href = `/comments/${node.attrs.comment_id}`;
            } else if (node.attrs.message_id) {
              href = `/messages/${node.attrs.message_id}`;
            } else {
              href = `/topics/${node.attrs.topic_id}`;
            }

            innerQuoteable = [
              'a',
              {
                class: 'b-link b-user16',
                href: prependBaseUrl(href),
                target: '_blank'
              },
              [
                'img',
                {
                  src: prependBaseUrl(
                    `/system/users/x16/${node.attrs.user_id}.png`
                  ),
                  srcset: prependBaseUrl(
                    `/system/users/x32/${node.attrs.user_id}.png 2x`
                  )
                }
              ],
              [
                'span',
                node.attrs.nickname
              ]
            ];
          } else {
            innerQuoteable = node.attrs.nickname;
          }

          return [
            'div',
            {
              class: 'b-quote',
              'data-comment_id': node.attrs.comment_id,
              'data-message_id': node.attrs.message_id,
              'data-topic_id': node.attrs.topic_id,
              'data-user_id': node.attrs.user_id,
              'data-nickname': node.attrs.nickname
            },
            ['div', { class: 'quoteable' }, innerQuoteable],
            ['div', 0]
          ];
        }
        return ['div', { class: 'b-quote' }, 0];
      }
    };
  }

  get markdownParserToken() {
    return {
      block: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    state.write('[quote]');
    state.ensureNewLine();
    state.renderContent(node);
    state.write('[/quote]');
    state.ensureNewLine();
  }
}
