// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Nodes/Doc.js
import Node from '../utils/node';

export default class Doc extends Node {
  get name() {
    return 'doc';
  }

  get schema() {
    return {
      content: 'block+'
    };
  }
}
