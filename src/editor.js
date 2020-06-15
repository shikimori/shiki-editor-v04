// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Editor.js

import { history, undo, redo } from 'prosemirror-history';
import { EditorState, TextSelection } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema } from 'prosemirror-model';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, joinBackward } from 'prosemirror-commands';
import { inputRules } from 'prosemirror-inputrules';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';

import {
  Doc,
  Text,
  Paragraph,
  Blockquote,
  BulltList,
  CodeBlock,
  Image,
  ListItem,
  Quote
} from './nodes';
import { Strong, Em, Underline, Deleted, CodeInline, Link } from './marks';
import {
  ExtensionManager,
  Emitter,
  ComponentView,
  buildMenu,
  getMarkAttrs,
  getNodeAttrs,
  minMax
} from './utils';
import { MarkdownParser, MarkdownSerializer, MarkdownTokenizer }
  from './markdown';
import { trackFocus } from './plugins';

export default class ShikiEditor extends Emitter {
  options = {
    autofocus: null,
    baseUrl: '',
    content: '',
    dropCursor: {},
    extensions: []
  }
  focused = false
  selection = { from: 0, to: 0 }

  constructor(options, Vue) {
    super(options);

    // setInterval(() => console.log(this.focused), 250)

    this.options = {
      ...this.options,
      ...options
    };
    this.Vue = Vue;

    this.extensions = this.createExtensions();
    this.element = this.options.element || document.createElement('div');

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

    this.setActiveNodesAndMarks();

    if (this.options.autoFocus !== null) {
      this.focus(this.options.autoFocus);
    }

    // give extension manager access to our view
    this.extensions.view = this.view;
  }

  get state() {
    return this.view ? this.view.state : undefined;
  }

  get builtInExtensions() {
    return [
      new Doc(),
      new Text(),
      new Paragraph(),
      new Strong(),
      new Em(),
      new Link(),
      new Underline(),
      new Deleted(),
      new CodeInline(),
      new Blockquote(),
      new BulltList(),
      new CodeBlock(),
      new Image(),
      new ListItem(),
      new Quote({ baseUrl: this.options.baseUrl })
    ];
  }

  createExtensions() {
    return new ExtensionManager([
      ...this.builtInExtensions,
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
      keymap(baseKeymap),
      dropCursor(this.options.dropCursor),
      gapCursor(),
      trackFocus(this)
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
    return new EditorView(this.element, {
      state: this.createState(),
      dispatchTransaction: this.dispatchTransaction.bind(this)
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

  initNodeViews({ parent, extensions }) {
    return extensions
      .filter(extension => ['node', 'mark'].includes(extension.type))
      .filter(extension => extension.view)
      .reduce((nodeViews, extension) => {
        const nodeView = (node, view, getPos, decorations) => {
          const component = extension.view;

          return new ComponentView(component, {
            editor: this,
            extension,
            parent,
            node,
            view,
            getPos,
            decorations
          }, this.Vue);
        };

        return {
          ...nodeViews,
          [extension.name]: nodeView
        };
      }, {});
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

  setActiveNodesAndMarks() {
    this.activeMarkAttrs = Object
      .entries(this.schema.marks)
      .reduce((memo, [name, mark]) => ({
        ...memo,
        [name]: getMarkAttrs(mark, this.state)
      }), {});

    this.isActive = [
      ...Object.entries(this.schema.marks),
      ...Object.entries(this.schema.nodes)
    ]
      .reduce((memo, [name, type]) => ({
        ...memo,
        [name]: (attrs = {}) => this.activeChecks[type.name](this.state, attrs)
      }), {});
  }

  getMarkAttrs(type = null) {
    return this.activeMarkAttrs[type];
  }

  getNodeAttrs(type = null) {
    return {
      ...getNodeAttrs(this.state, this.schema.nodes[type])
    };
  }

  setParentComponent(component = null) {
    if (!component) {
      return;
    }

    this.view.setProps({
      nodeViews: this.initNodeViews({
        parent: component,
        extensions: [
          ...this.builtInExtensions,
          ...this.options.extensions
        ],
        editable: this.options.editable
      })
    });
  }

  dispatchTransaction(transaction) {
    const { state } = this.state.applyTransaction(transaction);
    this.view.updateState(state);

    this.selection = {
      from: this.state.selection.from,
      to: this.state.selection.to
    };

    if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
      return;
    }

    this.setActiveNodesAndMarks();

    this.emit('update', { transaction });
  }

  resolveSelection(position = null) {
    if (this.selection && position === null) {
      return this.selection;
    }

    if (position === 'start' || position === true) {
      return {
        from: 0,
        to: 0
      };
    }

    if (position === 'end') {
      const { doc } = this.state;
      return {
        from: doc.content.size,
        to: doc.content.size
      };
    }

    return {
      from: position,
      to: position
    };
  }

  focus(position = null) {
    if ((this.view.focused && position === null) || position === false) {
      return;
    }

    const { from, to } = this.resolveSelection(position);

    this.setSelection(from, to);
    setTimeout(() => this.view.focus(), 10);
  }

  setSelection(from = 0, to = 0) {
    const { doc, tr } = this.state;
    const resolvedFrom = minMax(from, 0, doc.content.size);
    const resolvedEnd = minMax(to, 0, doc.content.size);
    const selection = TextSelection.create(doc, resolvedFrom, resolvedEnd);
    const transaction = tr.setSelection(selection);

    this.view.dispatch(transaction);
  }

  blur() {
    this.view.dom.blur();
  }

  exportMarkdown() {
    return this.markdownSerializer.serialize(this.state.doc);
  }

  registerPlugin(plugin = null, handlePlugins) {
    const plugins = typeof handlePlugins === 'function' ?
      handlePlugins(plugin, this.state.plugins) :
      [plugin, ...this.state.plugins];
    const newState = this.state.reconfigure({ plugins });
    this.view.updateState(newState);
  }

  unregisterPlugin(name = null) {
    if (!name || !this.view.docView) {
      return;
    }

    const newState = this.state.reconfigure({
      plugins: this.state.plugins.filter(plugin => (
        !plugin.key.startsWith(`${name}$`)
      ))
    });
    this.view.updateState(newState);
  }

  destroy() {
    if (!this.view) { return; }
    this.view.destroy();
  }
}
