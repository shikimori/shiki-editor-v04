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

  get markdownToken() {
    return { block: this.name };
  }

  command() {
    return () => {};
  }

  activeCheck({ type: _type }) {
    return () => {};
  }
}
