import Extension from './extension';

export default class Node extends Extension {
  constructor(options = {}) {
    super(options);
  }

  get name() {
    return null;
  }

  get type() {
    return 'node';
  }

  get view() {
    return null;
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
}
