// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-extensions/src/nodes/Image.js
import { Node } from '../base';
import { nodeInputRule } from '../commands';
import { ImageView } from '../node_views';

const IMAGE_INPUT_REGEX = /\[img\](.*?)\[\/img\]/;

export default class Image extends Node {
  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        isPoster: { default: false }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [{
        tag: 'span.b-image',
        getAttrs: node => ({
          src: node.children[0].src,
          isPoster: node.classList.contains('b-poster')
        })
      }, {
        tag: 'img.b-poster',
        getAttrs: node => ({ src: node.src, isPoster: true })
      }],
      toDOM: node => (
        node.attrs.isPoster ?
          ['img', { class: 'b-poster', src: node.attrs.src }] :
          [
            'span',
            { class: 'b-image unprocessed no-zoom' },
            ['img', { src: node.attrs.src }]
          ]
      )
    };
  }

  get view() {
    return ImageView;
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

  get markdownParserToken() {
    return {
      node: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    const tag = node.attrs.isPoster ? 'poster' : 'img';
    state.write(`[${tag}]${state.esc(node.attrs.src)}[/${tag}]`);
  }
}
