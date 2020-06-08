// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Editor.js

import { bind } from 'decko';

import { history, undo, redo } from 'prosemirror-history';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, joinBackward } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';

import {
  Doc,
  Text,
  Paragraph,
  CodeBlock,
  BulltList,
  ListItem,
  Blockquote
} from './nodes';
import {
  Strong,
  Em,
  Underline,
  Deleted,
  CodeInline
} from './marks';
import { ExtensionManager, Emitter, buildMenu } from './utils';

import {
  MarkdownParser,
  MarkdownSerializer,
  MarkdownTokenizer
} from './markdown';

export default class ShikiEditor extends Emitter {
  options = {
    node: null,
    extensions: [],
    content: ''
  }

  constructor(options) {
    super(options);

    this.options = {
      ...this.options,
      ...options
    };

    this.extensions = this.createExtensions();

    this.nodes = this.createNodes();
    this.marks = this.createMarks();
    this.schema = this.createSchema();

    this.markdownParser = this.createMarkdownParser();
    this.markdownSerializer = this.createMarkdownSerializer();

    this.keymaps = this.createKeymaps();
    this.inputRules = this.createInputRules();
    this.pasteRules = this.createPasteRules();
    this.view = this.createView();

    this.commands = this.createCommands();
    this.activeChecks = this.createActiveChecks();

    this.plugins = this.createPlugins();
    this.attachPlugins();

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
      new Strong(),
      new Em(),
      new Underline(),
      new Deleted(),
      new CodeInline(),
      new CodeBlock(),
      new BulltList(),
      new ListItem(),
      new Blockquote(),
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

  createMarkdownParser() {
    return new MarkdownParser(
      this.schema,
      MarkdownTokenizer,
      this.extensions.markdownParserTokens()
    );
  }

  createMarkdownSerializer() {
    const { nodes, marks } = this.extensions.markdownSerializerTokens();
    return new MarkdownSerializer(nodes, marks);
  }

  createPlugins() {
    return [
      ...this.extensions.plugins,
      history(),
      buildMenu(this),
      inputRules({
        rules: this.inputRules
      }),
      ...this.pasteRules,
      ...this.keymaps,
      keymap({
        'Mod-z': undo,
        'Shift-Mod-z': redo,
        Backspace: joinBackward
      }),
      keymap(baseKeymap)
    ];
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
    return new EditorView(this.options.node, {
      state: this.createState(),
      dispatchTransaction: this.dispatchTransaction
    });
  }

  createState() {
    return EditorState.create({
      schema: this.schema,
      doc: this.markdownParser.parse(this.options.content),
      plugins: []
    });
  }

  attachPlugins() {
    this.view.updateState(
      this.state.reconfigure({ plugins: this.plugins })
    );
  }

  createCommands() {
    return this.extensions.commands({
      schema: this.schema,
      view: this.view
    });
  }

  createActiveChecks() {
    return this.extensions.activeChecks({
      schema: this.schema,
      view: this.view
    });
  }

  setContent(content, emitUpdate = false) {
    const { doc, tr } = this.state;
    const document = this.markdownParser.parse(content);
    const selection = TextSelection.create(doc, 0, doc.content.size);
    const transaction = tr
      .setSelection(selection)
      .replaceSelectionWith(document, false)
      .setMeta('preventUpdate', !emitUpdate);

    this.view.dispatch(transaction);
  }

  @bind
  dispatchTransaction(transaction) {
    const { state } = this.state.applyTransaction(transaction);
    this.view.updateState(state);

    if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
      return;
    }

    this.emit('update', { transaction });
  }

  exportMarkdown() {
    return this.markdownSerializer.serialize(this.state.doc);
  }
}
