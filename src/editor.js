// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Editor.js

import { bind } from 'decko';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { inputRules, undoInputRule } from 'prosemirror-inputrules';

import { Doc, Text, Paragraph } from './nodes';
import { ExtensionManager } from './utils';

import { MarkdownParser, tokens } from './markdown/from_markdown';
import { Tokenizer } from './markdown/tokenizer';
import { buildMenu } from './build_menu';

export default class ShikiEditor {
  options = {
    node: null,
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
    this.textParser = this.createTextParser();
    this.plugins = this.createPlugins();
    this.keymaps = this.createKeymaps();
    this.inputRules = this.createInputRules();
    this.pasteRules = this.createPasteRules();
    this.view = this.createView();

    this.commands = this.createCommands();

    // give extension manager access to our view
    this.extensions.view = this.view;
  }

  get state() {
    return this.view?.state;
  }

  createExtensions() {
    return new ExtensionManager([
      new Doc(),
      new Text(),
      new Paragraph(),
      ...this.options.extensions
    ], this);
  }

  createNodes() {
    return this.extensions.nodes;
  }

  createMarks() {
    return this.extensions.marks;
  }

  createSchema() {
    return new Schema({
      topNode: 'doc',
      nodes: this.nodes,
      marks: this.marks
    });
  }

  createTextParser() {
    return new MarkdownParser(this.schema, Tokenizer, tokens);
  }

  createPlugins() {
    return this.extensions.plugins;
  }

  createKeymaps() {
    return this.extensions.keymaps({
      schema: this.schema
    });
  }

  createInputRules() {
    return this.extensions.inputRules({
      schema: this.schema,
      excludedExtensions: this.options.disableInputRules
    });
  }

  createPasteRules() {
    return this.extensions.pasteRules({
      schema: this.schema,
      excludedExtensions: this.options.disablePasteRules
    });
  }

  createView() {
    // return new EditorView(this.options.node, {
    //   state: EditorState.create({
    //     schema,
    //     plugins,
    //     doc: shikiMarkdownParser.parse(this.options.content)
    //   }),
    //   // doc: DOMParser.fromSchema(mySchema).parse(this.$textarea[0]),
    //   dispatchTransaction: transaction => {
    //     const { state } = this.view.state.applyTransaction(transaction);
    //     this.view.updateState(state);
    //   }
    // });

    return new EditorView(this.options.node, {
      state: this.createState(),
      // handlePaste: (...args) => { this.emit('paste', ...args); },
      // handleDrop: (...args) => { this.emit('drop', ...args); },
      dispatchTransaction: this.dispatchTransaction
    });
  }

  createState() {
    // return EditorState.create({
    //   schema,
    //   plugins,
    //   doc: shikiMarkdownParser.parse(this.options.content)
    // });

    return EditorState.create({
      schema: this.schema,
      doc: this.createDocument(this.options.content),
      plugins: [
        ...this.plugins,
        inputRules({
          rules: this.inputRules
        }),
        ...this.pasteRules,
        ...this.keymaps,
        keymap({
          Backspace: undoInputRule
        }),
        keymap(baseKeymap),
        buildMenu(this.schema)
        // dropCursor(this.options.dropCursor),
        // gapCursor(),
        // new Plugin({
        //   key: new PluginKey('editable'),
        //   props: {
        //     editable: () => this.options.editable
        //   }
        // }),
        // new Plugin({
        //   props: {
        //     attributes: {
        //       tabindex: 0
        //     },
        //     handleDOMEvents: {
        //       focus: (view, event) => {
        //         this.focused = true;
        //         this.emit('focus', {
        //           event,
        //           state: view.state,
        //           view
        //         });
        //
        //         const transaction = this.state.tr.setMeta('focused', true);
        //         this.view.dispatch(transaction);
        //       },
        //       blur: (view, event) => {
        //         this.focused = false;
        //         this.emit('blur', {
        //           event,
        //           state: view.state,
        //           view
        //         });
        //
        //         const transaction = this.state.tr.setMeta('focused', false);
        //         this.view.dispatch(transaction);
        //       }
        //     }
        //   }
        // }),
        // new Plugin({
        //   props: this.options.editorProps
        // })
      ]
    });
  }

  createCommands() {
    return this.extensions.commands({
      schema: this.schema,
      view: this.view
    });
  }

  createDocument(content) {
    return this.textParser.parse(content);
  }

  @bind
  dispatchTransaction(transaction) {
    const { state } = this.state.applyTransaction(transaction);
    this.view.updateState(state);

    // this.selection = {
    //   from: this.state.selection.from,
    //   to: this.state.selection.to
    // };
    // this.setActiveNodesAndMarks();
    //
    // this.emit('transaction', {
    //   getHTML: this.getHTML.bind(this),
    //   getJSON: this.getJSON.bind(this),
    //   state: this.state,
    //   transaction
    // });
    //
    // if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
    //   return;
    // }
    //
    // this.emitUpdate(transaction);
  }
}
