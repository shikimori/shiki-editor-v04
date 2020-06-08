// https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-utils/src/utils/nodeIsActive.js
import { findParentNode, findSelectedNodeOfType } from 'prosemirror-utils';

export default function (type, attrs = {}) {
  return (state, _dispatch, _view) => {
    const predicate = node => node.type === type;
    const node = findSelectedNodeOfType(type)(state.selection) ||
      findParentNode(predicate)(state.selection);

    if (!Object.keys(attrs).length || !node) {
      return !!node;
    }

    return node.node.hasMarkup(type, { ...node.node.attrs, ...attrs });
  };
}
