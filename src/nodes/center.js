// import { setBlockType } from 'prosemirror-commands';
import { Node } from '../base';

export default class Center extends Node {
  get name() {
    return 'center';
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      draggable: false,
      parseDOM: [{
        tag: 'center'
      }],
      toDOM: (node) => ['center', { 'data-div': '[center]' }, 0]
    };
  }

  markdownSerialize(state, node) {
    state.write(`[center]`);
    state.ensureNewLine();
    state.renderContent(node);
    state.write('[/center]');
    state.closeBlock(node);
  }
}
