import { Node } from '../base';

export default class Right extends Node {
  get name() {
    return 'right';
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      draggable: false,
      parseDOM: [{
        tag: 'div.right-text'
      }],
      toDOM: () => [
        'div',
        {
          class: 'right-text',
          'data-div': '[right]'
        },
        0
      ]
    };
  }

  markdownSerialize(state, node) {
    state.write('[right]');
    state.ensureNewLine();
    state.renderContent(node);
    state.write('[/right]');
    state.closeBlock(node);
  }
}
