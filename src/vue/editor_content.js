export default {
  props: {
    vue: { type: Function, required: true },
    editor: { type: Object, required: true }
  },

  watch: {
    editor: {
      immediate: true,
      handler(editor) {
        if (editor && editor.element) {
          this.$nextTick(() => {
            this.$el.appendChild(editor.element.firstChild);
            editor.setParentComponent(this, this.vue);
          });
        }
      }
    }
  },

  render(createElement) {
    return createElement('div');
  },

  beforeDestroy() {
    this.editor.element = this.$el;
  }
};
