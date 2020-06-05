import { MarkdownSerializerState } from './markdown_serializer_state';

export class MarkdownSerializer {
  // :: (Object<(state: MarkdownSerializerState, node: Node, parent: Node, index: number)>, Object)
  // Construct a serializer with the given configuration. The `nodes`
  // object should map node names in a given schema to function that
  // take a serializer state and such a node, and serialize the node.
  //
  // The `marks` object should hold objects with `open` and `close`
  // properties, which hold the strings that should appear before and
  // after a piece of text marked that way, either directly or as a
  // function that takes a serializer state and a mark, and returns a
  // string. `open` and `close` can also be functions, which will be
  // called as
  //
  //     (state: MarkdownSerializerState, mark: Mark,
  //      parent: Fragment, index: number) → string
  //
  // Where `parent` and `index` allow you to inspect the mark's
  // context to see which nodes it applies to.
  //
  // Mark information objects can also have a `mixable` property
  // which, when `true`, indicates that the order in which the mark's
  // opening and closing syntax appears relative to other mixable
  // marks can be varied. (For example, you can say `**a *b***` and
  // `*a **b***`, but not `` `a *b*` ``.)
  //
  // To disable character escaping in a mark, you can give it an
  // `escape` property of `false`. Such a mark has to have the highest
  // precedence (must always be the innermost mark).
  //
  // The `expelEnclosingWhitespace` mark property causes the
  // serializer to move enclosing whitespace from inside the marks to
  // outside the marks. This is necessary for emphasis marks as
  // CommonMark does not permit enclosing whitespace inside emphasis
  // marks, see: http://spec.commonmark.org/0.26/#example-330
  constructor(nodes, marks) {
    // :: Object<(MarkdownSerializerState, Node)> The node serializer
    // functions for this serializer.
    this.nodes = nodes;
    // :: Object The mark serializer info.
    this.marks = marks;
  }

  // :: (Node, ?Object) → string
  // Serialize the content of the given node to
  // [CommonMark](http://commonmark.org/).
  serialize(content, options) {
    const state = new MarkdownSerializerState(this.nodes, this.marks, options);
    state.renderContent(content);
    return state.out;
  }
}


// :: MarkdownSerializer
// A serializer for the [basic schema](#schema).
export const shikiMarkdownSerializer = new MarkdownSerializer({
  blockquote(state, node) {
    state.wrapBlock('> ', null, node, () => state.renderContent(node));
  },
  code_block(state, node) {
    state.write('```' + (node.attrs.language || '') + '\n');
    state.text(node.textContent, false);
    state.ensureNewLine();
    state.write('```');
    state.closeBlock(node);
  },
  bullet_list(state, node) {
    state.renderList(node, '  ', () => (node.attrs.bullet || '-') + ' ');
  },
  list_item(state, node) {
    state.renderContent(node);
  },
  paragraph(state, node) {
    if (node.content.content.length) {
      state.renderInline(node);
      state.closeBlock(node);
    } else {
      if (!state.atBlank) {
        state.closeBlock(node);
      }
      state.write('\n');
    }
  },
  text(state, node) {
    state.text(node.text);
  }
}, {
  em: { open: '[i]', close: '[/i]', mixable: true, expelEnclosingWhitespace: true },
  strong: { open: '[b]', close: '[/b]', mixable: true, expelEnclosingWhitespace: true },
  deleted: { open: '[s]', close: '[/s]', mixable: true, expelEnclosingWhitespace: true },
  underline: { open: '[u]', close: '[/u]', mixable: true, expelEnclosingWhitespace: true },
  code: {
    open(_state, _mark, parent, index) {
      return backticksFor(parent.child(index), -1);
    },
    close(_state, _mark, parent, index) {
      return backticksFor(parent.child(index - 1), 1);
    },
    escape: false
  }
});

function backticksFor(node, side) {
  const ticks = /`+/g;
  let m;
  let len = 0;

  if (node.isText) while (m = ticks.exec(node.text)) { len = Math.max(len, m[0].length); } // eslint-disable-line
  let result = len > 0 && side > 0 ? ' `' : '`';
  for (let i = 0; i < len; i++) result += '`';
  if (len > 0 && side < 0) result += ' ';
  return result;
}
