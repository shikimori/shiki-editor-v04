// based on
// https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Editor.js
export default class Editor {
  options = {
    element: null,
    extensions: [],
    content: ''
  }

  constructor(options) {
    this.options = {
      ...this.options,
      ...options
    };

    this.extensions = this.createExtensions();
    this.nodes = this.createNodes();
    this.marks = this.createMarks();
    this.schema = this.createSchema();
    this.plugins = this.createPlugins();
    this.keymaps = this.createKeymaps();
    this.inputRules = this.createInputRules();
    this.pasteRules = this.createPasteRules();
    this.view = this.createView();
    this.commands = this.createCommands();

    // give extension manager access to our view
    this.extensions.view = this.view;
  }
}
