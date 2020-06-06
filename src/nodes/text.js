// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Nodes/Text.js
import Node from '../utils/node';

export default class Text extends Node {
  get name() {
    return 'text';
  }

  get schema() {
    return {
      group: 'inline'
    };
  }
}