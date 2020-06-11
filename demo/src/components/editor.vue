<template>
  <div>
    <EditorContent :editor='editor' :vue='Vue' />
  </div>
</template>

<script>
import Vue from 'vue';
import Editor from '../../../src/editor';
import EditorContent from '../../../src/vue/editor_content';

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
      }),
      editorContent: this.content
    };
  },
  computed: {
    Vue() {
      return Vue;
    }
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
