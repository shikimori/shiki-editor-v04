import {
  MenuItem,
  // liftItem,
  undoItem,
  redoItem,
  menuBar
} from 'prosemirror-menu';
import icons from './utils/icons';
// import { TextSelection } from 'prosemirror-state';

// const canInsert = nodeType => state => {
//   const { $from } = state.selection;
//   for (let d = $from.depth; d >= 0; d--) {
//     const index = $from.index(d);
//     if ($from.node(d).canReplaceWith(index, index, nodeType)) {
//       return true;
//     }
//   }
//   return false;
// };

// const insertBlockAfter = (node, state, dispatch) => {
//   const { tr } = state;
//   const pos = tr.selection.$anchor.after();

//   tr.insert(pos, node);
//   const selection = TextSelection.near(tr.doc.resolve(pos));

//   tr.setSelection(selection);
//   if (dispatch) {
//     dispatch(tr);
//   }
// };

// const insertBlock = nodeType => (state, dispatch) => {
//   insertBlockAfter(nodeType.createAndFill(), state, dispatch);
// };
undoItem.spec.title = () => I18n.t('frontend.shiki_editor.undo');
redoItem.spec.title = () => I18n.t('frontend.shiki_editor.redo');

export function buildMenu({ schema, commands, activeChecks }) {
  const marks = [];
  const undos = [undoItem, redoItem];
  const blocks = [];

  ['strong', 'em', 'underline', 'deleted', 'code_inline'].forEach(type => {
    if (!schema.marks[type]) { return; }

    marks.push(
      new MenuItem({
        title: () => I18n.t(`frontend.shiki_editor.${type}`),
        icon: icons[type],
        enable: () => true,
        active: activeChecks[type],
        run: commands[type]
      })
    );
  });

  ['bullet_list', 'blockquote', 'code_block'].forEach(type => {
    if (!schema.nodes[type]) { return; }

    blocks.push(
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.code_block'),
        icon: icons[type],
        enable: () => true,
        active: activeChecks[type],
        run: commands[type]
      })
    );
  });
  // blocks.push(liftItem);

  return menuBar({
    floating: true,
    content: [marks, undos, blocks]
  });
}
