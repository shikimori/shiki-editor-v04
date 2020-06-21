import { Mark } from '../base';

export default class Color extends Mark {
  get name() {
    return 'size';
  }

  get schema() {
    return {
      attrs: {
        color: {}
      },
      parseDOM: [{
        tag: 'span',
        style: 'font-color',
        getAttrs: node => ({
          color: style.color
        })
      }],
      toDOM: (node) => [
        'span',
        { style: `color: ${node.attrs.color};` },
        0
      ]
    };
  }

  get markdownSerializerToken() {
    return {
      open(_state, mark, _parent, _index) {
        return `[color=${mark.attrs.color}]`;
      },
      close: '[/color]',
      mixable: true,
      expelEnclosingWhitespace: true
    };
  }
}
