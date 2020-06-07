import {
  MenuItem,
  wrapItem,
  liftItem,
  undoItem,
  redoItem,
  menuBar
} from 'prosemirror-menu';
import icons from './utils/icons';
// import { TextSelection } from 'prosemirror-state';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';

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

function toggleableBlockTypeItem(nodeType, options, schema) {
  const command = toggleBlockType(nodeType, schema.nodes.paragraph, options.attrs);

  return new MenuItem({
    run: command,
    enable(state) { return command(state); },
    active(state) {
      const { $from, to, node } = state.selection;
      if (node) return node.hasMarkup(nodeType, options.attrs);
      return to <= $from.end() && $from.parent.type === nodeType;
      // do not use hasMarkup because it compares node attributes
      // we don't need this check because `code_block` may have different
      // language attributes
      // return to <= $from.end() && $from.parent.hasMarkup(nodeType, options.attrs);
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

export function buildMenu({ schema, commands, activeChecks }) {
  const marks = [];
  const undos = [undoItem, redoItem];
  const blocks = [];

  ['strong', 'em', 'underline', 'deleted', 'code_inline'].forEach(type => {
    if (schema.marks[type]) {
      marks.push(
        new MenuItem({
          title: () => I18n.t(`frontend.shiki_editor.${type}`),
          icon: icons[type],
          enable: () => true,
          // active: activeChecks[type],
          active: activeChecks[type],
          run: commands[type]
          // active: markActive(schema.marks[type]),
          // run: toggleMark(schema.marks[type])
        })
      );
    }
  });

  if (schema.nodes.bullet_list) {
    blocks.push(
      wrapListItem(schema.nodes.bullet_list, {
        title: () => I18n.t('frontend.shiki_editor.list'),
        icon: icons.bulletList
      })
    );
  }
  if (schema.nodes.blockquote) {
    blocks.push(
      wrapItem(schema.nodes.blockquote, {
        title: () => I18n.t('frontend.shiki_editor.blockquote'),
        icon: icons.blockquote
      })
    );
  }
  if (schema.nodes.code_block) {
    blocks.push(
      new MenuItem({
        title: () => I18n.t('frontend.shiki_editor.code_block'),
        icon: icons.code_block,
        run: commands.code_block,
        enable: () => true,
        // enable: state => commands.code_block(state),
        active(state) {
          const { $from, to, node } = state.selection;
          if (node) {
            return node.type === schema.nodes.code_block;
          }
          return to <= $from.end() &&
            $from.parent.type === schema.nodes.code_block;
        }
      })
    );
  }
  blocks.push(liftItem);

  return menuBar({
    floating: true,
    content: [marks, undos, blocks]
  });
}
