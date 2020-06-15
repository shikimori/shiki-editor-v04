<template>
  <div>
    <EditorMenuBar
      v-slot='{ commands, isActive }'
      :editor="editor"
    >
      <div>
        <MenuItem type='strong' />
        <button
          class='icon'
          :class='{ "is-active": isActive.strong() }'
          @click='commands.strong'
        >
          BOLD ICON {{ isActive.strong() ? 'acitve' : 'not(active)' }}
        </button>
      </div>
    </EditorMenuBar>

    <EditorContent :editor='editor' />
  </div>
</template>

<script>
import Vue from 'vue';
import { Editor, EditorContent, EditorMenuBar } from '../../../src';
import MenuItem from './menu_item';

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
    MenuItem
  },
  props: {
    baseUrl: { type: String, required: true },
    content: { type: String, required: true }
  },
  data() {
    return {
      editor: new Editor({
        extensions: [],
        content: this.content,
        baseUrl: this.baseUrl
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
