import { textblockTypeInputRule } from 'prosemirror-inputrules';

import Node from '../utils/node';
import toggleBlockType from '../commands/toggle_block_type';

export default class CodeBlock extends Node {
  get name() {
    return 'code_block';
  }

  get schema() {
    return {
      content: 'text*',
      group: 'block',
      code: true,
      defining: true,
      marks: '',
      draggable: false,
      attrs: {
        language: { default: '' }
      },
      parseDOM: [{
        tag: 'pre',
        preserveWhitespace: 'full',
        getAttrs: node => (
          { language: node.getAttribute('data-langauge') || '' }
        )
      }],
      toDOM(node) {
        return [
          'pre',
          { class: 'b-code-v2', 'data-language': node.attrs.language || '' },
          ['code', 0]
        ];
      }
    };
  }

  get markdownToken() {
    return {
      block: 'code_block',
      getAttrs: token => ({
        language: token.attrGet('language')
      })
    };
  }

  inputRules({ type }) {
    return [
      textblockTypeInputRule(/^```\w* $/, type, match => ({
        language: match[0].match(/`+(\w*)/)[1] || ''
      }))
    ];
  }

  command({ schema, type }) {
    return () => toggleBlockType(type, schema.nodes.paragraph, {});
  }

  activeCheck({ type }) {
    return () => state => {
      const { $from, to, node } = state.selection;
      if (node) {
        return node.type === type;
      }
      return to <= $from.end() && $from.parent.type === type;
    };
  }
}
