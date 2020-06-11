<template>
  <div>
    <EditorContent :editor='editor' />
  </div>
</template>

<script>
import Vue from 'vue';
// import { Editor, EditorContent } from '../../../src';
import { Editor, EditorContent } from '../../../dist/index.es';

export default {
  name: 'Editor',
  components: {
    EditorContent
  },
  props: {
    content: { type: String, required: true }
  },
  data() {
    return {
      editor: new Editor({
        extensions: [],
        content: this.content
      }, Vue),
      editorContent: this.content
    };
  },
  watch: {
    content() {
      if (this.content !== this.editorContent) {
        this.editor.setContent(this.content);
      }
    }
  },
  created() {
    this.editor.on('update', () => {
      this.editorContent = this.editor.exportMarkdown();
      this.$emit('update', this.editorContent);
    });
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style scoped lang='sass'>
</style>
<style lang='sass'>
@import 'node_modules/reset-css/sass/reset'
@import @/stylesheets/application.sass
@import @/stylesheets/prosemirror.sass
</style>
