import { Node } from '../base';

export default class Image extends Node {
  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {}
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src')
          })
        }
      ],
      toDOM: node => ['img', node.attrs]
    };
  }

  get markdownParserToken() {
    return {
      node: 'image',
      getAttrs: token => ({
        language: token.attrGet('src')
      })
    };
  }

  // command({ type }) {
  //   return () => setBlockType(type);
  // }

  markdownSerialize(state, node) {
    state.write(`[img]${state.esc(node.attrs.src)}[/img]`);
  }
}
