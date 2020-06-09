// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-extensions/src/nodes/Image.js
import { Node } from '../base';
import { nodeInputRule } from '../commands';

const IMAGE_INPUT_REGEX = /\[img\](.*?)\[\/img\]/;

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

  inputRules({ type }) {
    return [
      nodeInputRule(IMAGE_INPUT_REGEX, type, match => {
        const [, src] = match;
        return { src };
      })
    ];
  }

  // command({ type }) {
  //   return () => setBlockType(type);
  // }

  markdownSerialize(state, node) {
    state.write(`[img]${state.esc(node.attrs.src)}[/img]`);
  }
}
