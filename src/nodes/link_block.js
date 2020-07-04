import { NodeWithAttrs } from '../base';
import { fixUrl } from '../utils';
import { nodeIsActive } from '../checks';
import { toggleWrap } from '../commands';

// NOTE: this node cannot be generated in WYSIWYG mode
export default class LinkBlock extends NodeWithAttrs {
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
          target: '_blank',
          'data-link': `[url=${node.attrs.href}]`
        },
        0
      ]
    };
  }

  commands({ type, schema }) {
    return () => toggleWrap(type, schema.nodes.paragraph);
  }

  activeCheck(type, state) {
    return nodeIsActive(type, state);
  }

  markdownSerialize(state, node) {
    state.renderBlock(node, 'url', `=${node.attrs.href}`);
  }
}
