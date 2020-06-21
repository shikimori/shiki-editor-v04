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
        isPoster: { default: false },
        width: { default: null },
        height: { default: null },
        isNoZoom: { default: false },
        class: { default: null }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [{
        tag: '.b-image',
        getAttrs: node => ({
          src: node.children[0].src,
          isPoster: node.classList.contains('b-poster')
        })
      }, {
        tag: 'img.b-poster',
        getAttrs: node => ({ src: node.src, isPoster: true })
      }],
      toDOM: node => {
        if (node.attrs.isPoster) {
          return ['img', { class: 'b-poster', src: node.attrs.src }];
        }
        const attrs = { src: node.attrs.src };
        if (node.attrs.width) {
          attrs.width = node.attrs.width;
        }
        if (node.attrs.height) {
          attrs.height = node.attrs.height;
        }
        const classes = ['b-image', 'unprocessed'];
        if (node.attrs.class) {
          classes.push(node.attrs.class);
        }
        if (node.attrs.isNoZoom) {
          classes.push('no-zoom');
        }

        return [
          'span',
          { class: classes },
          [ 'img', attrs ]
        ];
      }
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
