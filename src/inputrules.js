// https://github.com/ProseMirror/prosemirror-example-setup/blob/master/src/inputrules.js

import {
  inputRules,
  wrappingInputRule,
  textblockTypeInputRule
  // smartQuotes,
  // emDash,
  // ellipsis
} from 'prosemirror-inputrules';
import markInputRule from './commands/mark_input_rule';

import { schema } from './schema';

export default inputRules({
  rules: [
    wrappingInputRule(/^\s*>\s$/, schema.nodes.blockquote),
    wrappingInputRule(/^\s*([-+*])\s$/, schema.nodes.bullet_list),
    markInputRule(/(?:`)([^`]+)(?:`) $/, schema.marks.code),
    textblockTypeInputRule(/^```\w* $/, schema.nodes.code_block, match => ({
      language: match[0].match(/`+(\w*)/)[1] || ''
    }))
  ]
});
