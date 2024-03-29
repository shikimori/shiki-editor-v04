<template>
  <div>
    <div
      ref='menubar'
      class='menubar'
      :class='{ "is-sticky-menu-offset": isStickyMenuOffset }'
    >
      <div v-if='editor' v-dragscroll class='icons'>
        <div
          v-for='([group, items], index) in menuItems'
          :key='index'
          class='menu_group'
          :class='{
            [`menu_group-${group}`]: true,
            "is-active": activeMobileMenuGroup === group,
            "is-hidden": activeMobileMenuGroup && activeMobileMenuGroup !== group
          }'
        >
          <button
            class='mobile_placeholder'
            :class='{
              [`mobile_placeholder-${group}`]: true,
              "is-active": activeMobileMenuGroup === group
            }'
            @click='(e) => toggleMobileMenuGroup(group, e)'
          />
          <Icon
            v-for='item in items'
            :key='item.constructor === Object ? item.type : item'
            :ref='item.type'
            v-bind='item'
            :is-active='nodesState[item.type]'
            :is-enabled='item.isEditingEnabled ? item.isEditingEnabled() : isEditingEnabled'
            @command='args => command(item.type, args)'
          />
        </div>
        <div class='menu_group menu_group-controls'>
          <div
            v-if='isPreviewLoading'
            class='icon-loader b-ajax vk-like'
          />
          <Icon
            v-bind='menuPreviewItem'
            is-button
            :is-active='isPreview'
            :is-enabled='isPreviewEnabled'
            @command='() => togglePreview()'
          />
          <Icon
            v-bind='menuSourceItem'
            is-button
            :is-active='isSource'
            :is-enabled='isSourceEnabled'
            :is-disabled='isSourceDisabled'
            @command='() => toggleSource()'
          />
        </div>
      </div>
    </div>
    <!--
    {{ editor.selection.$from.pos }} - {{ editor.selection.$to.pos }}
    -->
    <div
      v-if='editor'
      ref='editor_container'
      class='editor-container'
      :class='{
        "is-loading": isPreviewLoading,
        "is-source": isSource && !isPreview
      }'
    >
      <div
        v-if='isPreview && previewHTML != null'
        ref='preview'
        class='preview'
        v-html='previewHTML'
      />
      <textarea
        v-else-if='isSource'
        ref='textarea'
        v-model='editorContent'
        class='ProseMirror'
        @keydown='handleSourceKeypress'
      />
      <EditorContent
        v-else
        :editor='editor'
      />
    </div>

    <Smileys
      v-show='isSmiley && isEditingEnabled'
      ref='smileys'
      :is-enabled='isSmiley'
      target-ref='smiley'
      :shiki-request='shikiRequest'
      :is-sticky-menu-offset='isStickyMenuOffset'
      @toggle='smileyCommand'
    />
    <Suggestions
      :is-available='isEditingEnabled'
      :editor='editor'
      :shiki-request='shikiRequest'
    />
  </div>
</template>

<script>
import autosize from 'autosize';
import withinviewport from 'withinviewport';
import { dragscroll } from 'vue-dragscroll';

import { keymap } from 'prosemirror-keymap';
import { undo, redo } from 'prosemirror-history';

import ShikiEditor from './editor';
import EditorContent from './components/editor_content';
import { contentToNodes, scrollTop } from './utils';
import { FileUploader, ShikiSearch } from './extensions';
import { insertReply, insertFragment, insertQuote } from './commands';

import { flash } from 'shiki-utils';

import Icon from './components/icon';
import Smileys from './components/smileys';
import Suggestions from './components/suggestions';

const MENU_ITEMS = {
  inline: [
    'bold',
    'italic',
    'underline',
    'strike',
    'spoiler_inline',
    'code_inline',
    'link'
  ],
  history: ['undo', 'redo'],
  item: ['smiley', 'image', 'shiki_link', 'upload'],
  block: ['blockquote', 'spoiler_block', 'code_block', 'bullet_list']
};
const MAXIMUM_CONTENT_SIZE = 100000;

const DEFAULT_DATA = {
  isSource: false,
  isItalicBlock: false,
  isBoldBlock: false,
  isLinkBlock: false,
  isSmiley: false,
  isPreview: false,
  isPreviewLoading: false,
  previewHTML: null,
  isHugeContent: false,
  activeMobileMenuGroup: null
};

export default {
  name: 'EditorApp',
  directives: {
    dragscroll
  },
  components: {
    EditorContent,
    Icon,
    Smileys,
    Suggestions
  },
  props: {
    vue: { type: Function, required: true },
    shikiRequest: { type: Object, required: true },
    content: { type: String, required: true },
    shikiUploader: { type: Object, required: true },
    globalSearch: { type: Object, required: false, default: undefined },
    localizationField: {
      type: String,
      required: true,
      validator: (value) => (
        [
          'name',
          'russian'
        ].indexOf(value) !== -1
      )
    },
    previewParams: { type: Object, required: false, default: undefined }
  },
  data: () => ({
    editor: null,
    editorContent: null,
    editorPosition: null,
    ...DEFAULT_DATA
  }),
  computed: {
    isEditingEnabled() {
      return !this.isSource && !this.isPreview;
    },
    isEditingEnabledMappings() {
      return {
        undo: this.undoIsEnabled,
        redo: this.redoIsEnabled
        // link: this.linkIsEnabled
      };
    },
    menuItems() {
      return Object.keys(MENU_ITEMS).map(group => (
        [
          group,
          MENU_ITEMS[group].map(item => ({
            type: item,
            title: window.I18n.t(`frontend.shiki_editor.${item}`),
            isEditingEnabled: this.isEditingEnabledMappings[item]
          }))
        ]
      ));
    },
    menuPreviewItem() {
      return {
        type: 'preview',
        title: window.I18n.t('frontend.shiki_editor.preview')
      };
    },
    menuSourceItem() {
      return {
        type: 'source',
        title: window.I18n.t('frontend.shiki_editor.source')
      };
    },
    nodesState() {
      const memo = {};

      Object.keys(MENU_ITEMS).forEach(group => (
        MENU_ITEMS[group].forEach(item => (
          memo[item] = this.editor.activeChecks[item] ?
            this.editor.activeChecks[item]() :
            false
        ))
      ));

      this.isBoldBlock = this.editor.activeChecks.bold_block(); // eslint-disable-line
      memo.bold = this.isBoldBlock || this.editor.activeChecks.bold_inline();

      this.isItalicBlock = this.editor.activeChecks.italic_block(); // eslint-disable-line
      memo.italic = this.isItalicBlock || this.editor.activeChecks.italic_inline();

      this.isLinkBlock = this.editor.activeChecks.link_block(); // eslint-disable-line
      memo.link = this.isLinkBlock || this.editor.activeChecks.link_inline();

      memo.smiley = this.isSmiley;

      return memo;
    },
    isContentManipulationsPending() {
      return this.fileUploaderExtension.isUploading;
    },
    isPreviewEnabled() {
      return !this.isContentManipulationsPending;
    },
    isSourceEnabled() {
      return !this.isHugeContent &&
        !this.isContentManipulationsPending;
        // !this.isContentManipulationsPending && !this.isPreview;
    },
    isSourceDisabled() {
      return this.isPreview;
    },
    fileUploaderExtension() {
      return new FileUploader({
        shikiUploader: this.shikiUploader
      });
    },
    shikiSearchExtension() {
      if (!this.globalSearch) { return null; }

      return new ShikiSearch({
        globalSearch: this.globalSearch
      });
    },
    isStickyMenuOffset() {
      const topMenuNode = document.querySelector('.l-top_menu-v2');
      if (!topMenuNode) { return false; }

      return getComputedStyle(topMenuNode).position === 'sticky';
    }
  },
  watch: {
    isSource() {
      if (this.isSource) {
        this.fileUploaderExtension.disable();
      } else {
        this.fileUploaderExtension.enable();
      }
    }
  },
  async created() {
    window.editorApp = this;
    this.createEditor();
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  methods: {
    focus(editorPosition = undefined) {
      if (this.isSource) {
        this.$refs.textarea.focus();
      } else {
        this.editor.focus(editorPosition);
      }
    },
    command(type, args) {
      this.toggleMobileMenuGroup(null);

      const prefix = type
        .split('_')
        .map((word, index) => (
          index ? `${word[0].toUpperCase()}${word.slice(1)}` : word
        ))
        .join('');
      const method = `${prefix}Command`;

      if (this[method] && this[method].constructor === Function) {
        return this[method](args);
      }

      switch (type) {
        case 'link':
          this.isLinkBlock ?
            this.editor.commands.link_block() :
            this.editor.commands.link_inline();
          break;

        case 'bold':
          this.isBoldBlock ?
            this.editor.commands.bold_block() :
            this.editor.commands.bold_inline();
          break;

        case 'italic':
          this.isItalicBlock ?
            this.editor.commands.italic_block() :
            this.editor.commands.italic_inline();
          break;

        default:
          this.editor.commands[type](args);
      }
    },
    undoCommand() {
      undo(this.editor.state, this.editor.view.dispatch);
      this.focus();
    },
    redoCommand() {
      redo(this.editor.state, this.editor.view.dispatch);
      this.focus();
    },
    smileyCommand(kind) {
      this.isSmiley = !this.isSmiley;

      if (kind) {
        this.editor.commands.smiley(kind);
      }
    },
    shikiLinkCommand() {
      if (!this.shikiSearchExtension) {
        alert('globalSearch prop is missing');
        return;
      }
      this.shikiSearchExtension.searchOpen(this.editor);
    },
    uploadCommand(files) {
      this.fileUploaderExtension.addFiles(files);
    },
    undoIsEnabled() {
      return this.isEditingEnabled && undo(this.editor.state);
    },
    redoIsEnabled() {
      return this.isEditingEnabled && redo(this.editor.state);
    },
    // linkIsEnabled() {
    //   return this.isEditingEnabled && (
    //     this.nodesState.link || !this.editor.state.selection.empty
    //   );
    // },
    appendReply(reply) {
      const { editor } = this;
      insertReply(reply)(editor.state, editor.view.dispatch);
      this.focus();
    },
    appendQuote(quote) {
      const { editor } = this;
      insertQuote(quote, editor)(editor.state, editor.view.dispatch);
      this.focus();
    },
    appendText(content) {
      const fragment = contentToNodes(this.editor, content);
      insertFragment(fragment)(this.editor.state, this.editor.view.dispatch);
      this.focus();
    },
    async setContent(
      content,
      isAaddToHistory = content !== this.editor.exportMarkdown()
    ) {
      if (this.isSource) {
        await this.toggleSource();
      }

      this.editor.setContent(
        content,
        false,
        isAaddToHistory
      );
    },
    clearContent() {
      this.editor.destroy();

      Object.keys(DEFAULT_DATA).forEach(key => (
        this[key] = DEFAULT_DATA[key]
      ));

      this.createEditor();
    },
    async createEditor() {
      this.isHugeContent = this.content.length > MAXIMUM_CONTENT_SIZE;

      const extensions = [this.fileUploaderExtension];
      if (this.shikiSearchExtension) {
        extensions.push(this.shikiSearchExtension);
      }

      this.editor = new ShikiEditor({
        content: this.isHugeContent ? '' : this.content,
        shikiRequest: this.shikiRequest,
        localizationField: this.localizationField,
        extensions,
        plugins: [
          keymap({ 'Mod-Enter': this.submit })
        ]
      }, this, this.vue);

      this.editorContent = this.content;

      if (this.isHugeContent) {
        this.toggleSource(this.content);
        await this.$nextTick();
        flash.info(window.I18n.t('frontend.shiki_editor.too_large_content'));
      }

      await this.$nextTick();

      this.fileUploaderExtension.attachShikiUploader({
        node: this.$refs.editor_container,
        progressContainerNode: this.$refs.menubar
      });
    },
    async togglePreview() {
      this.isPreview = !this.isPreview;
      this.isPreviewLoading = this.isPreview;

      if (this.isPreview) {
        const text = this.isSource ?
          this.editorContent :
          this.editor.exportMarkdown();

        const { data } = await this.shikiRequest.post(
          'preview',
          this.previewParams ? { ...this.previewParams, text } : { text }
        );

        if (data !== null) {
          const { html, JS_EXPORTS } = data;

          this.previewHTML = html;
          this.isPreviewLoading = false;

          await this.$nextTick();
          this.$emit('preview', { node: this.$refs.preview, JS_EXPORTS });
        } else {
          this.isPreview = false;
          this.isPreviewLoading = false;
        }
      } else {
        this.previewHTML = null;

        await this.$nextTick();
        if (this.isSource) {
          autosize(this.$refs.textarea);
        }
      }
    },
    async toggleSource(overrideContent) {
      this.isPreview = false;
      const scrollY = scrollTop();

      this.isSource = !this.isSource;

      if (this.isSource) {
        this.editorContent = overrideContent || this.editor.exportMarkdown();
        this.editorPosition = this.editor.selection.from;
      } else {
        this.setContent(this.editorContent);
      }

      await this.$nextTick();

      if (this.isSource) {
        autosize(this.$refs.textarea);
        this.focus();
        window.scrollTo(0, scrollY);

        if (!withinviewport(this.$refs.menubar, 'top')) {
          this.$refs.textarea.blur();
          this.$refs.textarea.focus();
        }
      } else {
        this.focus(this.editorPosition);
        window.scrollTo(0, scrollY);
      }
    },
    toggleMobileMenuGroup(group, e) {
      this.activeMobileMenuGroup = this.activeMobileMenuGroup === group ?
        null :
        group;

      if (e) {
        e.preventDefault();
        e.currentTarget.blur();
        this.editor.focus();
      }
    },
    exportContent() {
      return this.isSource ? this.editorContent : this.editor.exportMarkdown();
    },
    async handleSourceKeypress(e) {
      if (e.keyCode === 27) { // esc
        e.preventDefault();
        e.stopImmediatePropagation();

        this.toggleSource();
      }
      if (!e.metaKey && !e.ctrlKey) { return; }

      if ((e.keyCode === 10) || (e.keyCode === 13)) { // ctrl+enter
        e.preventDefault();
        e.stopImmediatePropagation();

        this.toggleSource();
        await this.$nextTick();

        this.submit();
      }
    },
    submit() {
      this.$emit('submit');
    }
  }
};
</script>

<style lang='sass'>
@import ./stylesheets/prosemirror.sass
@import ./stylesheets/prosemirror_shiki.sass
</style>

<style scoped lang='sass'>
@import ./stylesheets/mixins/responsive
@import ./stylesheets/mixins/icon

=group_separator
  border-right: 1px solid #ddd
  content: ''
  margin: 0 5px 0 3px

.menubar
  background: #fff
  left: 0
  padding: 3px 0
  position: sticky
  right: 0
  top: 0
  z-index: 30

  &.is-sticky-menu-offset
    top: 45px

  .icons
    color: #456
    display: flex
    flex-wrap: nowrap
    font-size: 16px
    min-height: 1em
    overflow: hidden

  /deep/ .shiki-file_uploader-upload_progress
    margin-top: 1px
    margin-bottom: 3px

.menu_group
  display: flex
  flex-wrap: nowrap
  padding: 5px 0

  +iphone
    /deep/ .icon
      display: none

      &.is-active
        display: block

    &.is-hidden
      display: none

    &.is-active:before
      display: none

    &.is-active,
    &.menu_group-controls,
    &.menu_group-history
      /deep/ .icon
        display: block

  .mobile_placeholder
    +iphone
      +icon

    +gte_ipad
      display: none

    &-history
      display: none

    &.is-active
      color: var(--link-active-color, #ff0202)
      position: relative
      margin-right: 9px
      background: transparent

      &:after
        +group_separator
        position: absolute
        top: 0
        right: -10px
        height: 100%

    $icons: ("inline": "\E80A", "item": "\E80E", "block": "\E80F")
    @each $name, $glyph in $icons
      &-#{$name}:before
        content: $glyph

  & + .menu_group:before
    +group_separator

  &.is-active,
  &-block
    margin-right: 30px

  &-controls
    margin-left: auto

    &:before
      display: none

  .icon-loader
    width: 55px

.editor-container
  &.is-loading
    position: relative

    &:before
      background: rgba(255, 255, 255, 0.75)
      content: ''
      height: 100%
      left: 0
      position: absolute
      top: 0
      width: 100%
      z-index: 3

  &.is-source
    line-height: 0

  .preview
    min-height: 89px
    padding: 5px 8px 5px
</style>
