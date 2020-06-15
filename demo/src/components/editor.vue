<template>
  <div>
    <EditorMenuBar
      v-slot='{ commands, activeChecks }'
      :editor="editor"
    >
      <div class='menubar'>
        <div
          v-for='(menuGroup, index) in menuGroups'
          :key='index'
          class='menu-group'
        >
          <MenuItem
            v-for='menuItem in menuGroup'
            :key='menuItem'
            :type='menuItem'
            :is-active='activeChecks[menuItem]()'
            :command='commands[menuItem]'
          />
        </div>
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
  computed: {
    menuGroups() {
      return [
        ['strong', 'em', 'underline', 'deleted', 'link', 'code_inline'],
        ['undo', 'redo'],
        ['image'],
        ['bullet_list', 'blockquote', 'code_block']
      ];
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
.menu-bar
  color: #456
  display: flex
  flex-wrap: wrap
  font-size: 14px
  left: 0
  min-height: 1em
  overflow: visible
  position: relative
  right: 0
  top: 0
  z-index: 10

.menu-group
  display: flex
  flex-wrap: wrap
</style>
