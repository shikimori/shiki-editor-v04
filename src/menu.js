import {
  icons,
  MenuItem,
  wrapItem,
  liftItem,
  undoItem,
  redoItem
  // blockTypeItem
} from 'prosemirror-menu';
import shikiIcons from './icons';
// import { TextSelection } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { schema } from './schema';
import toggleBlockType from './commands/toggle_block_type';

function cmdItem(cmd, options) {
  const passedOptions = {
    label: options.title,
    run: cmd
  };
  for (const prop in options) passedOptions[prop] = options[prop]; // eslint-disable-line
  if ((!options.enable || options.enable === true) && !options.select) {
    passedOptions[options.enable ? 'enable' : 'select'] = state => cmd(state);
  }

  return new MenuItem(passedOptions);
}

function wrapListItem(nodeType, options) {
  return cmdItem(wrapInList(nodeType, options.attrs), options);
}

const markActive = markType => state => {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return markType.isInSet(state.storedMarks || $from.marks());
  }
  return state.doc.rangeHasMark(from, to, markType);
};

function toggleableBlockTypeItem(nodeType, options) {
  const command = toggleBlockType(nodeType, schema.nodes.paragraph, options.attrs);

  return new MenuItem({
    run: command,
    enable(state) { return command(state); },
    active(state) {
      const { $from, to, node } = state.selection;
      if (node) return node.hasMarkup(nodeType, options.attrs);
      return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs);
    },
    ...options
  });
}

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

export const menu = {
  floating: true,
  content: [
    [
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.bold'),
        icon: icons.strong,
        enable: () => true,
        active: markActive(schema.marks.strong),
        run: toggleMark(schema.marks.strong)
      }),
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.italic'),
        icon: icons.em,
        enable: () => true,
        active: markActive(schema.marks.em),
        run: toggleMark(schema.marks.em)
      }),
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.underline'),
        icon: shikiIcons.underline,
        enable: () => true,
        active: markActive(schema.marks.underline),
        run: toggleMark(schema.marks.underline)
      }),
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.striked'),
        icon: shikiIcons.deleted,
        enable: () => true,
        active: markActive(schema.marks.deleted),
        run: toggleMark(schema.marks.deleted)
      }),
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.code'),
        icon: icons.code,
        enable: () => true,
        active: markActive(schema.marks.code),
        run: toggleMark(schema.marks.code)
      })
    ], [
      undoItem,
      redoItem
    ], [
      wrapListItem(schema.nodes.bullet_list, {
        title: () => I18n.t('frontend.shiki_editor.list'),
        icon: icons.bulletList
      }),
      wrapItem(schema.nodes.blockquote, {
        title: () => I18n.t('frontend.shiki_editor.blockquote'),
        icon: icons.blockquote
      }),
      toggleableBlockTypeItem(schema.nodes.code_block, {
        title: () => I18n.t('frontend.shiki_editor.code_block'),
        icon: shikiIcons.code_block
      }),
      liftItem
    ]
  ]
};
