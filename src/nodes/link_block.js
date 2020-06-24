import { Node } from '../base';
import { fixUrl } from '../utils';

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
          href: fixUrl(node.attrs.href),
          class: 'b-link prosemirror-block',
          rel: 'noopener noreferrer nofollow',
          target: '_blank'
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
  }
}
