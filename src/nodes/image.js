// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-extensions/src/nodes/Image.js
import { Node } from '../base';
import { nodeInputRule } from '../commands';
import { ImageView } from '../node_views';

const IMAGE_INPUT_REGEX = /\[img\](.*?)\[\/img\]/;

export class Image extends Node {
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
        getAttrs: node => JSON.parse(node.getAttribute('data-attrs'))
      }, {
        tag: 'img.b-poster',
        getAttrs: node => ({ src: node.src, isPoster: true })
      }],
      toDOM: node => {
        const serializedAttributes = JSON.stringify(node.attrs);
        if (node.attrs.isPoster) {
          return [
            'img',
            {
              class: 'b-poster',
              src: node.attrs.src,
              'data-attrs': serializedAttributes
            }
          ];
        }

        const attrs = { src: node.attrs.src };
        if (node.attrs.width) {
          attrs.width = node.attrs.width;
        }
        if (node.attrs.height) {
          attrs.height = node.attrs.height;
        }
        const classes = ['b-image'];
        if (node.attrs.class) {
          classes.push(node.attrs.class);
        }
        if (node.attrs.isNoZoom) {
          classes.push('no-zoom');
        }

        return [
          'div',
          {
            class: classes.join(' '),
            'data-attrs': serializedAttributes
          },
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
    const seq = serializeImageAttributes(node);

    if (node.attrs.isPoster) {
      state.write(`[poster${seq}]${state.esc(node.attrs.src)}[/poster]`);
      return;
    }


    state.write(`[img${seq}]${state.esc(node.attrs.src)}[/img]`);
  }
}

export function serializeImageAttributes(node) {
  if (node.attrs.isPoster) { return ''; }

  const attributes = [];
  if (node.attrs.isNoZoom) {
    attributes.push('no-zoom');
  }
  if (node.attrs.width && node.attrs.height) {
    attributes.push(`${node.attrs.width}x${node.attrs.height}`);
  } else {
    if (node.attrs.width) {
      attributes.push(`width=${node.attrs.width}`);
    }
    if (node.attrs.height) {
      attributes.push(`height=${node.attrs.height}`);
    }
  }

  return attributes.length ? ' ' + attributes.join(' ') : '';
}
