import { Node } from '../base';
// import { nodeInputRule } from '../commands';
// import { ImageView } from '../node_views';
//
// const IMAGE_INPUT_REGEX = /\[img\](.*?)\[\/img\]/;

export default class Smiley extends Node {
  get name() {
    return 'image';
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        kind: {}
      },
      group: 'inline',
      draggable: true,
      parseDOM: [{
        tag: 'img.smiley',
        getAttrs: node => ({
          kind: node.getAttribute('alt')
        })
      }],
      toDOM: node => ([
        'img',
        { class: 'smiley', alt: node.attrs.kind, title: node.attrs.kind }
      ])
    };
  }

  // inputRules({ type }) {
  //   return [
  //     nodeInputRule(IMAGE_INPUT_REGEX, type, match => {
  //       const [, src] = match;
  //       return { src };
  //     })
  //   ];
  // }
  //
  // commands({ type }) {
  //   return () => (state, dispatch) => {
  //     const src = prompt(I18n.t('frontend.shiki_editor.prompt.image_url'));
  //
  //     if (src !== null) {
  //       const { selection } = state;
  //       const position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
  //       const node = type.create({ src });
  //       const transaction = state.tr.insert(position, node);
  //       dispatch(transaction);
  //     }
  //   };
  // }

  get markdownParserToken() {
    return {
      node: this.name,
      getAttrs: token => token.serializeAttributes()
    };
  }

  markdownSerialize(state, node) {
    state.write(node.attrs.kind);
  }
}
