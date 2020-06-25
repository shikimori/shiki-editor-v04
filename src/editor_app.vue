<template>
  <div>
    <!--EditorMenuBar
      ref='menubar'
      v-slot='{ activeChecks, commands }'
      :editor="editor"
    -->
    <div class='menu-bar'>
      <div
        v-for='(items, index) in menuItems'
        :key='index'
        class='menu-group'
      >
        <Icon
          v-for='item in items'
          :key='item.constructor === Object ? item.type : item'
          v-bind='item'
          :is-active='isActive[item.type]'
          :is-enabled='item.isEnabled ? item.isEnabled() : isEnabled'
          @command='() => command(item.type)'
        />
      </div>
      <div class='menu-group source'>
        <Icon
          v-bind='menuSourceItem'
          :is-active='isSource'
          is-enabled
          @command='() => toggleSourceCommand()'
        />
      </div>
    </div>
    <!--/EditorMenuBar-->

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

import Editor from './editor';
import EditorContent from './components/editor_content';
// import EditorMenuBar from './components/editor_menu_bar';
import Icon from './components/icon';
import { scrollTop } from './utils';

const MENU_ITEMS = [
  [
    'bold',
    'italic',
    'underline',
    'strike',
    'spoiler_inline',
    'code_inline',
    'link_inline'
  ],
  ['undo', 'redo'],
  ['image'],
  ['blockquote', 'spoiler_block', 'code_block', 'bullet_list']
];

export default {
  name: 'EditorApp',
  components: {
    EditorContent,
    // EditorMenuBar,
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
    isEnabledMappings() {
      return {
        undo: this.undoIsEnabled,
        redo: this.redoIsEnabled
      };
    },
    menuItems() {
      return MENU_ITEMS.map(items => items.map(item => ({
        type: item,
        title: I18n.t(`frontend.shiki_editor.${item}`),
        isEnabled: this.isEnabledMappings[item]
      })));
    },
    menuSourceItem() {
      return {
        type: 'source',
        title: I18n.t('frontend.shiki_editor.undo')
      };
    },
    isActive() {
      const memo = {};

      MENU_ITEMS.forEach(items => items.forEach(item => (
        memo[item] = this.editor.activeChecks[item] ?
          this.editor.activeChecks[item]() :
          false
      )));

      // this.editor.activeChecks.link_block() ? 'link_block' : 'link_inline'

      return memo;
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
    command(type) {
      const method = `${type}Command`;

      if (this[method] && this[method].constructor === Function) {
        this[method]();
      } else {
        this.editor.commands[type]();
      }
    },
    undoCommand() {
      undo(this.editor.state, this.editor.view.dispatch);
      this.editor.focus();
    },
    redoCommand() {
      redo(this.editor.state, this.editor.view.dispatch);
      this.editor.focus();
    },
    undoIsEnabled() {
      return this.isEnabled && undo(this.editor.state);
    },
    redoIsEnabled() {
      return this.isEnabled && redo(this.editor.state);
    },
    toggleSourceCommand() {
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

/deep/
  [data-image]:hover,
  [data-image].is-prosemirror-selected,
  [data-div]:hover,
  [data-div].is-prosemirror-selected
    position: relative
    outline: 1px solid #8cf

    &:before
      background: #fcfcfc
      font-family: Monaco, Menlo, Consolas, Courier New, monospace;
      color: #2b8acc
      cursor: pointer
      display: inline
      font-size: 9px
      font-weight: normal
      left: 0
      letter-spacing: 0.8px
      line-height: 1
      padding: 2px
      pointer-events: none
      position: absolute
      text-shadow: 1px 1px 0px #fff
      top: 0
      z-index: 999

  [data-div]
    &.is-prosemirror-selected:before,
    &:hover:before
      content: attr(data-div)

  [data-image]
    &.is-prosemirror-selected:before,
    &:hover:before
      content: attr(data-image)
</style>
