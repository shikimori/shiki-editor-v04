// import { setBlockType } from 'prosemirror-commands';
import { Node } from '../base';

export default class Div extends Node {
  get name() {
    return 'div';
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      draggable: false,
      parseDOM: [{
        tag: 'div[data-div]'
      }],
      toDOM: () => ['div', { 'data-div': true }, 0]
    };
  }

  // commands({ type }) {
  //   return () => setBlockType(type);
  // }
  // 
  // markdownSerialize(state, node) {
  //   if (node.content.content.length) {
  //     state.renderInline(node);
  //     state.closeBlock(node);
  //   } else {
  //     if (!state.atBlank) {
  //       state.closeBlock(node);
  //     }
  //     state.write('\n');
  //   }
  // }
}
