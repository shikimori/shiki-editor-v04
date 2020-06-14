import { Node } from '../base';

export default class Quote extends Node {
  get name() {
    return 'quote';
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
            ['div', { class: 'quoteable' }, node.attrs.nickname],
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

// <div class="quoteable"><a class="b-link b-user16 bubbled-processed" href="/comments/5983625"><img src="https://desu.shikimori.one/system/users/x16/467283.png?1587042532" srcset="https://desu.shikimori.one/system/users/x32/467283.png?1587042532 2x" alt="Veniamin"><span>Veniamin</span></a></div>
