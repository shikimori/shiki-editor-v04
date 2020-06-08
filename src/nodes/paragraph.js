// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Nodes/Paragraph.js
import { setBlockType } from '../commands';
import Node from '../utils/node';

export default class Paragraph extends Node {
  get name() {
    return 'paragraph';
  }

  get schema() {
    return {
      content: 'inline*',
      group: 'block',
      draggable: false,
      parseDOM: [{
        tag: 'p'
      }],
      toDOM: () => ['p', 0]
    };
  }

  command({ type }) {
    return () => setBlockType(type);
  }
}
