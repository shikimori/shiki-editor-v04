/* eslint-disable */
// https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/from_markdown.js

import markdownit from 'markdown-it';
import { Mark } from 'prosemirror-model';

import { Tokenizer } from './tokenizer';
import { schema } from '../schema';

function maybeMerge(a, b) {
  if (a.isText && b.isText && Mark.sameSet(a.marks, b.marks)) return a.withText(a.text + b.text);
}

// Object used to track the context of a running parse.
class MarkdownParseState {
  constructor(schema, tokenHandlers) {
    this.schema = schema;
    this.stack = [{ type: schema.topNodeType, content: [] }];
    this.marks = Mark.none;
    this.tokenHandlers = tokenHandlers;
  }

  top() {
    return this.stack[this.stack.length - 1];
  }

  push(elt) {
    if (this.stack.length) this.top().content.push(elt);
  }

  // : (string)
  // Adds the given text to the current position in the document,
  // using the current marks as styling.
  addText(text) {
    if (!text) return;
    const nodes = this.top().content; const
      last = nodes[nodes.length - 1];
    const node = this.schema.text(text, this.marks); let
      merged;
    if (last && (merged = maybeMerge(last, node))) nodes[nodes.length - 1] = merged;
    else nodes.push(node);
  }

  // : (Mark)
  // Adds the given mark to the set of active marks.
  openMark(mark) {
    this.marks = mark.addToSet(this.marks);
  }

  // : (Mark)
  // Removes the given mark from the set of active marks.
  closeMark(mark) {
    this.marks = mark.removeFromSet(this.marks);
  }

  parseTokens(toks) {
    for (let i = 0; i < toks.length; i++) {
      const tok = toks[i];
      const handler = this.tokenHandlers[tok.type];
      if (!handler) throw new Error('Token type `' + tok.type + '` not supported by Markdown parser');
      handler(this, tok);
    }
  }

  // : (NodeType, ?Object, ?[Node]) → ?Node
  // Add a node at the current position.
  addNode(type, attrs, content) {
    const node = type.createAndFill(attrs, content, this.marks);
    if (!node) return null;
    this.push(node);
    return node;
  }

  // : (NodeType, ?Object)
  // Wrap subsequent content in a node of the given type.
  openNode(type, attrs) {
    this.stack.push({ type, attrs, content: [] });
  }

  // : () → ?Node
  // Close and return the node that is currently on top of the stack.
  closeNode() {
    if (this.marks.length) this.marks = Mark.none;
    const info = this.stack.pop();
    return this.addNode(info.type, info.attrs, info.content);
  }
}

function attrs(spec, token) {
  if (spec.getAttrs) return spec.getAttrs(token);
  // For backwards compatibility when `attrs` is a Function
  if (spec.attrs instanceof Function) return spec.attrs(token);
  return spec.attrs;
}

// Code content is represented as a single token with a `content`
// property in Markdown-it.
function noOpenClose(type) {
  return type == 'code_inline' || type == 'code_block' || type == 'fence';
}

function withoutTrailingNewline(str) {
  return str[str.length - 1] == '\n' ? str.slice(0, str.length - 1) : str;
}

function noOp() {}

function tokenHandlers(schema, tokens) {
  const handlers = Object.create(null);
  for (const type in tokens) {
    const spec = tokens[type];
    if (spec.block) {
      const nodeType = schema.nodeType(spec.block);
      if (noOpenClose(type)) {
        handlers[type] = (state, tok) => {
          state.openNode(nodeType, attrs(spec, tok));
          state.addText(withoutTrailingNewline(tok.content));
          state.closeNode();
        };
      } else {
        handlers[type + '_open'] = (state, tok) => state.openNode(nodeType, attrs(spec, tok));
        handlers[type + '_close'] = state => state.closeNode();
      }
    } else if (spec.node) {
      const nodeType = schema.nodeType(spec.node);
      handlers[type] = (state, tok) => state.addNode(nodeType, attrs(spec, tok));
    } else if (spec.mark) {
      const markType = schema.marks[spec.mark];
      if (noOpenClose(type)) {
        handlers[type] = (state, tok) => {
          state.openMark(markType.create(attrs(spec, tok)));
          state.addText(withoutTrailingNewline(tok.content));
          state.closeMark(markType);
        };
      } else {
        handlers[type + '_open'] = (state, tok) => state.openMark(markType.create(attrs(spec, tok)));
        handlers[type + '_close'] = state => state.closeMark(markType);
      }
    } else if (spec.ignore) {
      if (noOpenClose(type)) {
        handlers[type] = noOp;
      } else {
        handlers[type + '_open'] = noOp;
        handlers[type + '_close'] = noOp;
      }
    } else {
      throw new RangeError('Unrecognized parsing spec ' + JSON.stringify(spec));
    }
  }

  handlers.text = (state, tok) => state.addText(tok.content);
  handlers.inline = (state, tok) => state.parseTokens(tok.children);
  handlers.softbreak = handlers.softbreak || (state => state.addText('\n'));

  return handlers;
}

// ::- A configuration of a Markdown parser. Such a parser uses
// [markdown-it](https://github.com/markdown-it/markdown-it) to
// tokenize a file, and then runs the custom rules it is given over
// the tokens to create a ProseMirror document tree.
export class MarkdownParser {
  // :: (Schema, MarkdownIt, Object)
  // Create a parser with the given configuration. You can configure
  // the markdown-it parser to parse the dialect you want, and provide
  // a description of the ProseMirror entities those tokens map to in
  // the `tokens` object, which maps token names to descriptions of
  // what to do with them. Such a description is an object, and may
  // have the following properties:
  //
  // **`node`**`: ?string`
  //   : This token maps to a single node, whose type can be looked up
  //     in the schema under the given name. Exactly one of `node`,
  //     `block`, or `mark` must be set.
  //
  // **`block`**`: ?string`
  //   : This token comes in `_open` and `_close` variants (which are
  //     appended to the base token name provides a the object
  //     property), and wraps a block of content. The block should be
  //     wrapped in a node of the type named to by the property's
  //     value.
  //
  // **`mark`**`: ?string`
  //   : This token also comes in `_open` and `_close` variants, but
  //     should add a mark (named by the value) to its content, rather
  //     than wrapping it in a node.
  //
  // **`attrs`**`: ?Object`
  //   : Attributes for the node or mark. When `getAttrs` is provided,
  //     it takes precedence.
  //
  // **`getAttrs`**`: ?(MarkdownToken) → Object`
  //   : A function used to compute the attributes for the node or mark
  //     that takes a [markdown-it
  //     token](https://markdown-it.github.io/markdown-it/#Token) and
  //     returns an attribute object.
  //
  // **`ignore`**`: ?bool`
  //   : When true, ignore content for the matched token.
  constructor(schema, tokenizer, tokens) {
    // :: Object The value of the `tokens` object used to construct
    // this parser. Can be useful to copy and modify to base other
    // parsers on.
    this.tokens = tokens;
    this.schema = schema;
    this.tokenizer = tokenizer;
    this.tokenHandlers = tokenHandlers(schema, tokens);
  }

  // :: (string) → Node
  // Parse a string as [CommonMark](http://commonmark.org/) markup,
  // and create a ProseMirror document as prescribed by this parser's
  // rules.
  parse(text) {
    const state = new MarkdownParseState(this.schema, this.tokenHandlers); let
      doc;

    // state.parseTokens(this.tokenizer.parse(text, {}));
    state.parseTokens(Tokenizer.parse(text));

    do { doc = state.closeNode(); } while (state.stack.length);
    return doc;
  }
}

// :: MarkdownParser
// A parser parsing unextended [CommonMark](http://commonmark.org/),
// without inline HTML, and producing a document in the basic schema.
const markdownTokenizer = markdownit('commonmark', { html: false });

window.markdownTokenizer = markdownTokenizer;
window.Tokenizer = Tokenizer;

const tokens = {
  // ordered_list: { block: 'ordered_list', getAttrs: tok => ({ order: +tok.attrGet('start') || 1 }) },
  // heading: { block: 'heading', getAttrs: tok => ({ level: +tok.tag.slice(1) }) },
  // fence: { block: 'code_block', getAttrs: tok => ({ params: tok.info || '' }) },
  // hr: { node: 'horizontal_rule' },
  // image: { node: 'image',
  //   getAttrs: tok => ({
  //     src: tok.attrGet('src'),
  //     title: tok.attrGet('title') || null,
  //     alt: tok.children[0] && tok.children[0].content || null
  //   }) },
  // hardbreak: { node: 'hard_break' },

  paragraph: { block: 'paragraph' },
  blockquote: { block: 'blockquote' },
  list_item: { block: 'list_item' },
  bullet_list: { block: 'bullet_list' },
  code_block: { block: 'code_block' },

  em: { mark: 'em' },
  strong: { mark: 'strong' },
  del: { mark: 'deleted' },
  underline: { mark: 'underline' }
  // link: { mark: 'link',
  //   getAttrs: tok => ({
  //     href: tok.attrGet('href'),
  //     title: tok.attrGet('title') || null
  //   }) },
  // code_inline: { mark: 'code' }
};

export const markitMarkdownParser = new MarkdownParser(schema, Tokenizer, tokens);
export const shikiMarkdownParser = new MarkdownParser(schema, Tokenizer, tokens);
