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
}
