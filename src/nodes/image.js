// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-extensions/src/nodes/Image.js
import { Node } from '../base';
import { nodeInputRule } from '../commands';
import ImageApp from '../vue/image.vue';

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
        tag: 'span.b-image',
        getAttrs: dom => ({
          src: dom.getAttribute('data-src')
        })
      }],
      toDOM: node => [
        'span',
        {
          class: 'b-image unprocessed no-zoom',
          'data-src': node.attrs.src
        },
        // { class: 'b-image unprocessed', href: node.attrs.src },
        ['img', node.attrs]
        // [
        //   'div',
        //   { class: 'controls' },
        //   ['div', { class: 'delete' }]
        // ]
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

  get view() {
    return ImageApp;
  }

  inputRules({ type }) {
    return [
      nodeInputRule(IMAGE_INPUT_REGEX, type, match => {
        const [, src] = match;
        return { src };
      })
    ];
  }

  commands({ type }) {
    return () => (state, dispatch) => {
      const src = prompt(I18n.t('frontend.shiki_editor.prompt.image_url'));

      if (src !== null) {
        const { selection } = state;
        const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
        const node = type.create({ src });
        const transaction = state.tr.insert(position, node);
        dispatch(transaction);
      }
    };
  }

  markdownSerialize(state, node) {
    state.write(`[img]${state.esc(node.attrs.src)}[/img]`);
  }
}
