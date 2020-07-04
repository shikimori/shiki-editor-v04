import Node from './node';

export default class NodeWithAttrs extends Node {
  constructor(options = {}) {
    super(options);
  }

  get markdownParserToken() {
    return {
      node: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }
}
