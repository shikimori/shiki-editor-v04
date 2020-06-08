import Extension from './extension';

export default class Node extends Extension {
  constructor(options = {}) {
    super(options);
  }

  get type() {
    return 'node';
  }

  get schema() {
    return null;
  }

  command({ type: _type }) {
    return () => _state => {};
  }

  activeCheck({ type: _type }) {
    return () => _state => {};
  }

  get markdownParserToken() {
    return { block: this.name };
  }

  markdownSerialize(_state, _node) {
    return null;
  }
}
