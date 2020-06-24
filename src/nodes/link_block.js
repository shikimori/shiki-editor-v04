import { Node } from '../base';

export default class LinkBlock extends Node {
  get name() {
    return 'link_block';
  }

  get schema() {
    return {
      attrs: {
        href: {}
      },
      content: 'block+',
      group: 'block',
      draggable: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: node => ({
            href: node.getAttribute('href')
          })
        }
      ],
      toDOM: (node) => [
        'a',
        {
          'data-link_block': '',
          ...node.attrs
        },
        0
      ]
    };
  }

  get markdownParserToken() {
    return {
      block: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    state.renderBlock(node, 'url', `=${node.attrs.href}`);

    // state.write(`[url=${node.attrs.href}]`);
    // state.renderContent(node);
    // state.write('[/url]');
  }
}
