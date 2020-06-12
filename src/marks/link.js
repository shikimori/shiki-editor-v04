// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-extensions/src/marks/Link.js
import { Plugin } from 'prosemirror-state';
import { Mark } from '../base';
import { updateMark, removeMark, pasteRule } from '../commands';
import { getMarkAttrs } from '../utils';

export default class Link extends Mark {
  get name() {
    return 'link';
  }

  get defaultOptions() {
    return {
      openOnClick: true
    };
  }

  get schema() {
    return {
      attrs: {
        href: { default: '' }
      },
      inclusive: false,
      parseDOM: [
        {
          tag: 'a[href]',
          getAttrs: node => ({
            href: node.getAttribute('href')
          })
        }
      ],
      toDOM: node => ['a', {
        ...node.attrs,
        class: 'b-link',
        rel: 'noopener noreferrer nofollow',
        target: '_blank'
      }, 0]
    };
  }

  commands({ type }) {
    return state => {
      let marks = [];
      const { from, to } = state.selection;

      state.doc.nodesBetween(from, to, (node) => {
        marks = [...marks, ...node.marks];
      });

      const mark = marks.find((markItem) => markItem.type.name === 'link');

      if (mark && mark.attrs.href) {
        return removeMark(type);
      } else {
        const href = prompt(I18n.t('frontend.shiki_editor.prompt.link_url'));
        return updateMark(type, { href });
      }
    };
  }

  pasteRules({ type }) {
    return [
      pasteRule(
        /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-zA-Z]{2,}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g,
        type,
        url => ({ href: url })
      )
    ];
  }

  get plugins() {
    if (!this.options.openOnClick) {
      return [];
    }

    return [
      new Plugin({
        props: {
          handleClick: (view, pos, event) => {
            const { schema } = view.state;
            const attrs = getMarkAttrs(view.state, schema.marks.link);

            if (attrs.href && event.target instanceof HTMLAnchorElement) {
              event.stopPropagation();
              window.open(attrs.href);
            }
          }
        }
      })
    ];
  }

  get markdownParserToken() {
    return {
      mark: 'link',
      getAttrs: token => ({
        href: token.attrGet('href')
      })
    };
  }

  get markdownSerializerToken() {
    return {
      open(_state, mark, _parent, _index) {
        return `[url=${mark.attrs.href}]`;
      },
      close: '[/url]'
    };
  }
}
