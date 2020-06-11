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
        { class: 'b-image unprocessed' },
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
    return {
      props: ['node', 'updateAttrs'],
      methods: {
        onChange() {
          debugger;
          // this.updateAttrs({
          //   done: !this.node.attrs.done,
          // })
        }
      },
      template: `
        <a class='b-image unprocessed' :href='node.attrs.src'>
          <div class='controls'><div class='delete' /></div>
          <img :src='node.attrs.src'>
        </a>
      `
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
