import { bind } from 'decko';

// based on
// https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Utils/Extension.js
export default class Extension {
  constructor(options = {}) {
    this.options = {
      ...this.defaultOptions,
      ...options
    };
  }

  init() {
    return null;
  }

  bindEditor(editor = null) {
    this.editor = editor;
  }

  get name() {
    return null;
  }

  get type() {
    return 'extension';
  }

  get defaultOptions() {
    return {
      baseUrl: ''
    };
  }

  get plugins() {
    return [];
  }

  @bind
  prependBaseUrl(url) {
    return `${this.options.baseUrl}${url}`;
  }

  inputRules() {
    return [];
  }

  pasteRules() {
    return [];
  }

  keys() {
    return {};
  }
}
