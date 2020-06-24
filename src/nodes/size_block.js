import { Node } from '../base';
import { ensureDimension } from '../utils';

export default class SizeBlock extends Node {
  get name() {
    return 'size_block';
  }

  get schema() {
    return {
      attrs: {
        size: {}
      },
      content: 'block+',
      group: 'block',
      draggable: false,
      parseDOM: [{
        tag: 'div',
        style: 'font-size',
        getAttrs: value => {
          const match = value.match(this.SIZE_REGEXP);
          return match ? { size: match[1] } : null;
        }
      }],
      toDOM: (node) => [
        'div',
        {
          style: `font-size: ${ensureDimension(node.attrs.size, 'px')};`
        },
        0
      ]
    };
  }

  get markdownParserToken() {
    return {
      block: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    state.renderBlock(node, 'size', `=${node.attrs.size}`);
  }
}
