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
        nickname: { default: undefined },
      },
      parseDOM: [{ tag: 'div.b-quote' }],
      toDOM() { return ['div', { class: 'b-quote' }, 0]; }
    };
  }

  get markdownSerializerToken() {
    return {
      open: '[quote]',
      close: '[/quote]',
      mixable: true,
      expelEnclosingWhitespace: true
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
