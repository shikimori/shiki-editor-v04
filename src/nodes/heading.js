import { Node } from '../base';

export default class Heading extends Node {
  get name() {
    return 'heading';
  }

  get schema() {
    return {
      attrs: {
        level: {}
      },
      content: 'inline*',
      group: 'block',
      defining: true,
      draggable: false,
      // parseDOM: this.options.levels
      //   .map(level => ({
      //     tag: `h${level}`,
      //     attrs: { level },
      //   })),
      toDOM: node => {
        if (node.attrs.level <= 2) {
          return [`h${node.attrs.level + 1}`, 0];
        } else {
          const css_class = node.attrs.level === 3 ? 'headline' : 'midheadline';
          return ['div', { class: css_class }, 0];
        }
      }
    };
  }

  get markdownParserToken() {
    return {
      block: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    state.write(state.repeat('#', node.attrs.level) + ' ');
    state.renderInline(node);
    state.closeBlock(node);
  }
}
