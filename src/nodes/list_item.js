import Node from '../utils/node';
// import { splitListItem, liftListItem, sinkListItem } from 'tiptap-commands';

export default class ListItem extends Node {
  get name() {
    return 'list_item';
  }

  get schema() {
    return {
      content: 'block*',
      defining: true,
      parseDOM: [{ tag: 'li' }],
      toDOM() { return ['li', 0]; }
    };
  }

  get markdownToken() {
    return { block: 'list_item' };
  }

  // keys({ type }) {
  //   return {
  //     Enter: splitListItem(type),
  //     Tab: sinkListItem(type),
  //     'Shift-Tab': liftListItem(type)
  //   };
  // }
}
