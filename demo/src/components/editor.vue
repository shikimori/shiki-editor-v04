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
      })
    };
  },
  computed: {
    Vue() {
      return Vue;
    }
  },
  beforeDestroy() {
    this.editor.destroy();
  }
};
</script>

<style scoped lang='sass'>
</style>
<style lang='sass'>
@import @/stylesheets/application.sass
</style>
