// import { setBlockType } from 'prosemirror-commands';
import { Node } from '../base';

export default class Div extends Node {
  get name() {
    return 'div';
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      draggable: false,
      attrs: {
        class: { default: null },
        data: { default: null }
      },
      parseDOM: [{
        tag: 'div[data-div]'
      }],
      toDOM: (node) => {
        const attributes = {};
        if (node.attrs.class) {
          attributes.class = node.attrs.class;
        }
        if (node.attrs.data) {
          node.attrs.data.forEach(data => attributes[data] = '');
        }
        return ['div', { 'data-div': '', ...attributes }, 0];
      }
    };
  }

  get markdownParserToken() {
    return {
      block: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    const { attrs } = node;
    const class_markdown = attrs.class ? `=${attrs.class}`: '';
    const data_markdown = attrs.data ? ` ${attrs.data.join(' ')}` : '';

    state.write(`[div${class_markdown}${data_markdown}]`);
    state.renderContent(node);
    state.write('[/div]');
  }
}
