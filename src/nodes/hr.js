import { nodeInputRule } from '../commands';
import { Node } from '../base';

export default class Hr extends Node {
  get name() {
    return 'hr';
  }

  get schema() {
    return {
      group: 'block',
      parseDOM: [{
        tag: 'hr'
      }],
      toDOM: () => ['hr']
    };
  }

  inputRules({ type }) {
    return [
      nodeInputRule(/^(?:---|___\s|\*\*\*\s)$/, type)
    ];
  }

  markdownSerialize(state, node) {
    state.write('[hr]');
    state.closeBlock(node);
  }

  get markdownParserToken() {
    return { node: this.name };
  }
}
