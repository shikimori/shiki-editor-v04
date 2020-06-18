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
        label: { default: '' }
      },
      parseDOM: [{
        tag: 'div.b-spoiler_block'
        // preserveWhitespace: 'full',
        // getAttrs: node => (
        //   { language: node.getAttribute('data-langauge') || '' }
        // )
      }],
      toDOM(node) {
        const label = node.attrs.label ?
          node.attrs.label :
          I18n.t('frontend.shiki_editor.spoiler');

        return [
          'div',
          { class: 'b-spoiler_block' },
          ['div', { class: 'label' }, label],
          ['div', { class: 'inner' }, 0]
        ];
      }
    };
  }

  commands({ schema, type }) {
    return () => toggleBlockType(type, schema.nodes.paragraph, {});
  }

  activeCheck(type, state) {
    return nodeIsActive(type, state);
  }

  inputRules({ type }) {
    return [
      textblockTypeInputRule(/^```\w* $/, type, match => ({
        language: match[0].match(/`+(\w*)/)[1] || ''
      }))
    ];
  }

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
