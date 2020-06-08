// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-commands/src/commands/toggleWrap.js
import { wrapIn, lift } from 'prosemirror-commands';
import { nodeIsActive } from '../utils';

export default function (type) {
  return (state, dispatch, view) => {
    const isActive = nodeIsActive(type)(state);

    if (isActive) {
      return lift(state, dispatch);
    }

    return wrapIn(type)(state, dispatch, view);
  };
}
