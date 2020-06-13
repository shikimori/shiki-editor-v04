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
