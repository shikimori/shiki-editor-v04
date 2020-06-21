import { Mark } from '../base';

export default class Size extends Mark {
  get name() {
    return 'size';
  }

  get schema() {
    return {
      attrs: {
        size: {}
      },
      parseDOM: [{
        tag: 'span',
        style: 'font-size',
        getAttrs: node => ({
          size: style.fontSize
        })
      }],
      toDOM: (node) => {
        const size = node.attrs.size === String(parseInt(node.attrs.size)) ?
          `${node.attrs.size}px` : node.attrs.size;

        return [
          'span',
          { style: `font-size: ${size};` },
          0
        ];
      }
    };
  }

  get markdownParserToken() {
    return {
      mark: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  get markdownSerializerToken() {
    return {
      open(_state, mark, _parent, _index) {
        return `[size=${mark.attrs.size}]`;
      },
      close: '[/size]',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
