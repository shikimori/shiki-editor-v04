// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Components/EditorMenuBar.js
import { menuBar } from '../plugins';

export default {
  props: {
    editor: {
      default: null,
      type: Object
    }
  },

  data() {
    return {
      focused: false
    };
  },

  watch: {
    editor: {
      immediate: true,
      handler(editor) {
        if (editor) {
          this.$nextTick(() => {
            editor.registerPlugin(menuBar({
              editor,
              element: this.$el
            }));

            this.focused = editor.focused;

            editor.on('focus', () => {
              this.focused = true;
            });

            editor.on('menubar:focusUpdate', focused => {
              this.focused = focused;
            });
          });
        }
      }
    }
  },

  render() {
    if (!this.editor) {
      return null;
    }

    return this.$scopedSlots.default({
      focused: this.focused,
      focus: this.editor.focus,
      commands: this.editor.commands,
      isActive: this.editor.isActive,
      getMarkAttrs: this.editor.getMarkAttrs.bind(this.editor),
      getNodeAttrs: this.editor.getNodeAttrs.bind(this.editor)
    });
  }
};
