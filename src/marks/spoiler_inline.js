import { Mark } from '../base';
import { markInputRule, markPasteRule } from '../commands';

export default class SpoilerInline extends Mark {
  get name() {
    return 'spoiler_inline';
  }

  get schema() {
    return {
      parseDOM: [{ tag: 'span.b-spoiler_inline' }],
      toDOM: () => [
        'span',
        { class: 'b-spoiler_inline is-opened' },
        ['span', 0]
      ]
    };
  }

  get view() {
    return (_node, _view, _getPos, _decorations) => {
      const dom = document.createElement('span');
      const contentDOM = document.createElement('span');

      dom.classList.add('b-spoiler_inline');
      dom.classList.add('is-opened');
      dom.addEventListener('click', () => dom.classList.toggle('is-opened'));
      dom.appendChild(contentDOM);

      return { dom, contentDOM };
    };
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:\|\|)([^|]+)(?:\|\|)$/, type)
    ];
  }

  pasteRules({ type }) {
    return [
      markPasteRule(/(?:\|\|)([^|]+)(?:\|\|)/g, type)
    ];
  }

  get markdownSerializerToken() {
    return {
      open: '||',
      close: '||',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
