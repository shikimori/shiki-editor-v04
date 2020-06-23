import { Node } from '../base';

export default class LinkBlock extends Node {
  get name() {
    return 'link_block';
  }

  get schema() {
    return {
      attrs: {
        href: {}
      },
      content: 'block+',
      group: 'block',
      draggable: false,
      // parseDOM: [{
      //   tag: 'center'
      // }],
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: node => ({
            href: node.getAttribute('href')
          })
        }
      ],
      toDOM: (node) => ['a', { ...node.attrs }, 0]
    };
  }

  // markdownSerialize(state, node) {
  //   state.renderBlock(node, 'center');
  // }
}
