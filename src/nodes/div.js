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
        data: { default: [] }
      },
      parseDOM: [{
        tag: 'div[data-div]',
        getAttrs: node => ({
          class: node.getAttribute('class'),
          data: node
            .getAttributeNames()
            .filter(name => name != 'data-div' && name.startsWith('data-'))
        })
      }],
      toDOM: (node) => {
        const attributes = {};

        if (node.attrs.class) {
          attributes.class = node.attrs.class;
        }
        node.attrs.data.forEach(data => attributes[data] = '');

        return [
          'div',
          {
            'data-div': (
              `[div${serializeClassAttr(node)}${serializeDataAttr(node)}]`
            ),
             ...attributes
          },
          0
        ];
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
    state.write(`[div${serializeClassAttr(node)}${serializeDataAttr(node)}]`);
    state.ensureNewLine();
    state.renderContent(node);
    state.write('[/div]');
    state.closeBlock(node);
  }
}

function serializeClassAttr(node) {
  return node.attrs.class ? `=${node.attrs.class}`: '';
}

function serializeDataAttr(node) {
  return node.attrs.data.length ? ` ${node.attrs.data.join(' ')}` : '';
}
