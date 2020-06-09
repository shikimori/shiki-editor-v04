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
      parseDOM: [{
        tag: 'a.b-image',
        getAttrs: dom => ({
          src: dom.getAttribute('href')
        })
      }],
      toDOM: node => [
        'a',
        { class: 'b-image unprocessed', href: node.attrs.src },
        ['img', node.attrs]
      ]
    };
  }

  get markdownParserToken() {
    return {
      node: 'image',
      getAttrs: token => ({
        src: token.attrGet('src')
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
