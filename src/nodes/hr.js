// import { setBlockType } from 'prosemirror-commands';
import { Node } from '../base';

export default class Hr extends Node {
  get name() {
    return 'hr';
  }

  get schema() {
    return {
      group: 'block',
      parseDOM: [{
        tag: 'hr'
      }],
      toDOM: () => ['hr']
    };
  }

  markdownSerialize(state, node) {
    state.write('[hr]');
    state.closeBlock(node);
  }
}
