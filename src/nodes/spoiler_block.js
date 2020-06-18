import { textblockTypeInputRule } from 'prosemirror-inputrules';

import { Node } from '../base';
import { nodeIsActive } from '../checks';
import { toggleBlockType } from '../commands';

export default class SpoilerBlock extends Node {
  get name() {
    return 'spoiler_block';
  }

  get schema() {
    return {
      content: 'block*',
      group: 'block',
      defining: true,
      draggable: false,
      attrs: {
        label: { default: I18n.t('frontend.shiki_editor.spoiler') },
        isOpened: { default: true }
      },
      parseDOM: [{
        tag: 'div.b-spoiler_block',
        getAttrs: node => (
          {
            label: node.children[0].innerText || '',
            isOpened: node.classList.contains('is-opened')
          }
        ),
        contentElement: node => node.children[1]
      }],
      toDOM(node) {
        return [
          'div',
          {
            class: `b-spoiler_block${node.attrs.isOpened ? ' is-opened' : ''}`
          },
          ['button', node.attrs.label],
          ['div', 0]
        ];
      }
    };
  }

  get view() {
    return (node, view, getPos) => {
      const dom = document.createElement('div');
      const button = document.createElement('button');
      const contentDOM = document.createElement('div');

      dom.classList.add('b-spoiler_block');
      if (node.attrs.isOpened) {
        dom.classList.add('is-opened');
      }
      button.addEventListener('click', () =>
        view.dispatch(
          view.state.tr.setNodeMarkup(
            getPos(),
            null,
            { ...node.attrs, isOpened: !node.attrs.isOpened }
          )
        )
      );
      button.innerText = node.attrs.label;

      dom.appendChild(button);
      dom.appendChild(contentDOM);

      return { dom, contentDOM };
    };
  }

  // commands({ schema, type }) {
  //   return () => toggleBlockType(type, schema.nodes.paragraph, {});
  // }

  activeCheck(type, state) {
    return nodeIsActive(type, state);
  }

  // inputRules({ type }) {
  //   return [
  //     textblockTypeInputRule(/^```\w* $/, type, match => ({
  //       language: match[0].match(/`+(\w*)/)[1] || ''
  //     }))
  //   ];
  // }

  get markdownParserToken() {
    return {
      block: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    const label = node.attrs.label;
    state.write(`[spoiler${label ? '=' + label : ''}]\n`);
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('[/spoiler]');
    state.closeBlock(node);
  }
}
