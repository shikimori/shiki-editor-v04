<template>
  <div>
    <EditorMenuBar
      v-slot='{ activeChecks, commands }'
      ref='menubar'
      :editor="editor"
    >
      <div class='menu-bar'>
        <div
          v-for='(menuItems, index) in menuGroups'
          :key='index'
          class='menu-group'
        >
          <Icon
            v-for='item in menuItems'
            :key='item.constructor === Object ? item.type : item'
            v-bind='
              item.constructor === Object ?
                item :
                buildMenuItem(item, activeChecks, commands)
            '
          />
        </div>
        <div class='menu-group source'>
          <Icon v-bind='menuSourceItem' />
        </div>
      </div>
    </EditorMenuBar>

    <textarea
      v-if='isSource'
      ref='textarea'
      v-model='editorContent'
      class='ProseMirror'
    />
    <EditorContent v-else :editor='editor' />
  </div>
</template>

<script>
import Vue from 'vue';
import { undo, redo } from 'prosemirror-history';
import autosize from 'autosize';
import withinviewport from 'withinviewport';

import { Editor, EditorContent, EditorMenuBar } from '../../../src';
import { scrollTop } from '../../../src/utils';
import Icon from './icon';

export default {
  name: 'Editor',
  components: {
    EditorContent,
    EditorMenuBar,
    Icon
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
      editorContent: this.content,
      isSource: false,
      editorPosition: null
    };
  },
  computed: {
    isEnabled() {
      return !this.isSource;
    },
    menuGroups() {
      return [
        ['strong', 'em', 'underline', 'deleted', 'spoiler_inline', 'code_inline', 'link'],
        [{
          type: 'undo',
          title: I18n.t('frontend.shiki_editor.undo'),
          command: () => {
            undo(this.editor.state, this.editor.view.dispatch);
            this.editor.focus();
          },
          isActive: false,
          isEnabled: this.isEnabled && undo(this.editor.state)
        }, {
          type: 'redo',
          title: I18n.t('frontend.shiki_editor.redo'),
          command: () => {
            redo(this.editor.state, this.editor.view.dispatch);
            this.editor.focus();
          },
          isActive: false,
          isEnabled: this.isEnabled && redo(this.editor.state)
        }],
        ['image'],
        ['blockquote', 'spoiler_block', 'code_block', 'bullet_list']
      ];
    },
    menuSourceItem() {
      return {
        type: 'source',
        title: I18n.t('frontend.shiki_editor.undo'),
        command: this.toggleSource,
        isActive: this.isSource,
        isEnabled: true
      };
    }
  },
  // watch: {
  //   content() {
  //     if (this.content !== this.editorContent) {
  //       this.editor.setContent(this.content);
  //     }
  //   }
  // },
  created() {
    // this.editor.on('update', () => {
    //   this.editorContent = this.editor.exportMarkdown();
    //   this.$emit('update', this.editorContent);
    // });
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    buildMenuItem(type, activeChecks, commands) {
      return {
        type: type,
        title: I18n.t(`frontend.shiki_editor.${type}`),
        command: commands[type],
        isActive: activeChecks[type](),
        isEnabled: this.isEnabled
      };
    },
    toggleSource() {
      const scrollY = scrollTop();

      if (this.isSource) {
        this.editor.setContent(this.editorContent);
      } else {
        this.editorContent = this.editor.exportMarkdown();
        this.editorPosition = this.editor.selection.from;
      }

      this.isSource = this.isEnabled;

      this.$nextTick().then(() => {
        if (this.isSource) {
          autosize(this.$refs.textarea);
          this.$refs.textarea.focus();
          window.scrollTo(0, scrollY);
          if (!withinviewport(this.$refs.menubar.$el, 'top')) {
            this.$refs.textarea.blur();
            this.$refs.textarea.focus();
          }
        } else {
          this.editor.focus(this.editorPosition);
          window.scrollTo(0, scrollY);
        }
      });
    }
  }
};
</script>

<style scoped lang='sass'>
.menu-bar
  background: #fff
  color: #456
  display: flex
  flex-wrap: wrap
  font-size: 16px
  left: 0
  min-height: 1em
  overflow: visible
  padding: 3px 0
  position: sticky
  right: 0
  top: 0
  z-index: 10

.menu-group
  display: flex
  flex-wrap: wrap
  padding: 5px 0

  & + .menu-group:before
    border-right: 1px solid #ddd
    content: ''
    margin: 0 5px 0 3px

  &.source
    margin-left: auto

    &:before
      display: none

textarea.ProseMirror
  min-height: 89px
  outline: none
  width: 100%
</style>
