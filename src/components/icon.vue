<template>
  <button
    ref='icon'
    class='icon'
    :tabindex='isEnabled ? undefined : -1'
    :title='title'
    :class='{
      [type]: true,
      "is-active": isEnabled && isActive,
      "is-disabled": !isEnabled
    }'
    @click='execute'
  />
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    type: { type: String, required: true },
    title: { type: String, required: true },
    command: { type: Function, required: true },
    isActive: { type: Boolean, required: true },
    isEnabled: { type: Boolean, required: false, default: true }
  },
  methods: {
    execute() {
      if (!this.isEnabled) { return; }
      this.$refs.icon.blur();
      this.command();
    }
  }
};
</script>

<style scoped lang='sass'>
.icon
  -webkit-appearance: none
  background: transparent
  border-radius: 4px
  border: none
  font-size: 14px
  height: 19px
  margin: 0 1px
  padding: 0 4px
  width: 27px

  &:active
    outline: none

  &:not(.is-disabled)
    color: #456
    cursor: pointer

    @media screen and (min-width: 1024px)
      &:hover
        color: var(--link-hover-color, #dd5202)

    &:active
      color: var(--link-active-color, #ff0202)

  &.is-disabled
    color: rgba(#123, 0.3)
    outline: none

  &.is-active
    background: rgba(#acb1b4, 0.25)

  &:before
    // it is a copy of shikimori font mixin
    font-family: shikimori
    -webkit-font-smoothing: antialiased
    -moz-osx-font-smoothing: grayscale
    font-feature-settings: 'liga'
    text-transform: none
    letter-spacing: normal

  $icons: ("strong": "\e802", "em": "\e804", "underline": "\e807", "deleted": "\e805", "link_inline": "\1f517", "spoiler_inline": "\f31a", "code_inline": "\ef53", "undo": "\ebb0", "redo": "\ebaf", "image": "\e81d", "bullet_list": "\ebab", "blockquote": "\e80b", "code_block": "\ebac", "spoiler_block": "\f31b")
  @each $name, $glyph in $icons
    &.#{$name}:before
      content: $glyph

  &.source
    width: auto

    &:before
      font-family: Courier New
      font-weight: bold

      body[data-locale=ru] &
        content: '<код>'

      body[data-locale=en] &
        content: '<source>'
</style>
