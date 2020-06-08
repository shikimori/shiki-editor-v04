// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Utils/ExtensionManager.js
import { keymap } from 'prosemirror-keymap';

export default class ExtensionManager {
  constructor(extensions = [], editor) {
    extensions.forEach(extension => {
      extension.bindEditor(editor);
      extension.init();
    });
    this.extensions = extensions;
  }

  get nodes() {
    return this.extensions
      .filter(extension => extension.type === 'node')
      .reduce((nodes, { name, schema }) => ({
        ...nodes,
        [name]: schema
      }), {});
  }

  get options() {
    const { view } = this;
    return this.extensions
      .reduce((nodes, extension) => ({
        ...nodes,
        [extension.name]: new Proxy(extension.options, {
          set(obj, prop, value) {
            const changed = (obj[prop] !== value);

            Object.assign(obj, { [prop]: value });

            if (changed) {
              view.updateState(view.state);
            }

            return true;
          }
        })
      }), {});
  }

  get marks() {
    return this.extensions
      .filter(extension => extension.type === 'mark')
      .reduce((marks, { name, schema }) => ({
        ...marks,
        [name]: schema
      }), {});
  }

  get plugins() {
    return this.extensions
      .filter(extension => extension.plugins)
      .reduce((memo, { plugins }) => ([
        ...memo,
        ...plugins
      ]), []);
  }

  keymaps({ schema }) {
    const extensionKeymaps = this.extensions
      .filter(extension => ['extension'].includes(extension.type))
      .filter(extension => extension.keys)
      .map(extension => extension.keys({ schema }));

    const nodeMarkKeymaps = this.extensions
      .filter(extension => ['node', 'mark'].includes(extension.type))
      .filter(extension => extension.keys)
      .map(extension => extension.keys({
        type: schema[`${extension.type}s`][extension.name],
        schema
      }));

    return [
      ...extensionKeymaps,
      ...nodeMarkKeymaps
    ].map(keys => keymap(keys));
  }

  inputRules({ schema, excludedExtensions }) {
    if (!(excludedExtensions instanceof Array) && excludedExtensions) return [];

    const allowedExtensions = (excludedExtensions instanceof Array) ? this.extensions
      .filter(extension => !excludedExtensions.includes(extension.name)) : this.extensions;

    const extensionInputRules = allowedExtensions
      .filter(extension => ['extension'].includes(extension.type))
      .filter(extension => extension.inputRules)
      .map(extension => extension.inputRules({ schema }));

    const nodeMarkInputRules = allowedExtensions
      .filter(extension => ['node', 'mark'].includes(extension.type))
      .filter(extension => extension.inputRules)
      .map(extension => extension.inputRules({
        type: schema[`${extension.type}s`][extension.name],
        schema
      }));

    return [
      ...extensionInputRules,
      ...nodeMarkInputRules
    ].reduce((memo, inputRules) => ([
      ...memo,
      ...inputRules
    ]), []);
  }

  pasteRules({ schema, excludedExtensions }) {
    if (!(excludedExtensions instanceof Array) && excludedExtensions) return [];

    const allowedExtensions = (excludedExtensions instanceof Array) ? this.extensions
      .filter(extension => !excludedExtensions.includes(extension.name)) : this.extensions;

    const extensionPasteRules = allowedExtensions
      .filter(extension => ['extension'].includes(extension.type))
      .filter(extension => extension.pasteRules)
      .map(extension => extension.pasteRules({ schema }));

    const nodeMarkPasteRules = allowedExtensions
      .filter(extension => ['node', 'mark'].includes(extension.type))
      .filter(extension => extension.pasteRules)
      .map(extension => extension.pasteRules({
        type: schema[`${extension.type}s`][extension.name],
        schema
      }));

    return [
      ...extensionPasteRules,
      ...nodeMarkPasteRules
    ].reduce((memo, pasteRules) => ([
      ...memo,
      ...pasteRules
    ]), []);
  }

  markdownParserTokens() {
    return this.extensions
      .filter(extension => extension.markdownParserToken)
      .reduce((memo, extension) => {
        memo[extension.name] = extension.markdownParserToken;
        return memo;
      }, {});
  }

  markdownSerializerTokens() {
    const nodes = this.extensions
      .filter(extension => extension.markdownSerialize)
      .reduce((memo, extension) => {
        const { name, markdownSerialize } = extension;
        memo[name] = markdownSerialize;
        return memo;
      }, {});

    const marks = this.extensions
      .filter(extension => extension.markdownSerializerToken)
      .reduce((memo, extension) => {
        const { name, markdownSerializerToken } = extension;
        memo[name] = markdownSerializerToken;
        return memo;
      }, {});

    return { nodes, marks };
  }

  activeChecks({ schema, view }) {
    return this.extensions
      .filter(extension => extension.activeCheck)
      .reduce((memo, extension) => {
        const { name, type } = extension;
        const schemaType = schema[`${type}s`][name];

        memo[extension.name] = _state => (
          extension.activeCheck(schemaType, view.state)
        );
        return memo;
      }, {});
  }

  commands({ schema, view }) {
    return this.extensions
      .filter(extension => extension.command)
      .reduce((memo, extension) => {
        const { name, type } = extension;
        const commands = {};
        const value = extension.command({
          schema,
          ...['node', 'mark'].includes(type) ? {
            type: schema[`${type}s`][name]
          } : {}
        });

        const apply = (cb, attrs) => {
          if (!view.editable) {
            return false;
          }
          view.focus();
          return cb(attrs)(view.state, view.dispatch, view);
        };

        const handle = (_name, _value) => {
          if (Array.isArray(_value)) {
            commands[_name] = attrs => (
              _value.forEach(callback => apply(callback, attrs))
            );
          } else if (typeof _value === 'function') {
            commands[_name] = attrs => apply(_value, attrs);
          }
        };

        if (typeof value === 'object') {
          Object.entries(value).forEach(([commandName, commandValue]) => {
            handle(commandName, commandValue);
          });
        } else {
          handle(name, value);
        }

        return {
          ...memo,
          ...commands
        };
      }, {});
  }
}
