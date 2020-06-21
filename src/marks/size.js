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
      toDOM: (node) => [
        'span',
        { style: `font-size: ${node.attrs.size};` },
        0
      ]
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
