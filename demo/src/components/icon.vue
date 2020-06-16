<template>
  <button
    class='icon'
    :tabindex='isEnabled ? undefined : -1'
    :title='title'
    :class='{
      [type]: true,
      "is-active": isActive,
      "is-disabled": !isEnabled
    }'
    @click='command'
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
  }
};
</script>

<style scoped lang='sass'>
@import @/stylesheets/core

.icon
  -webkit-appearance: none
  background: transparent
  border-radius: 4px
  border: none
  font-size: 14px
  height: 19px
  margin: 0 1px
  padding: 0
  width: 25px

  &:active
    outline: none

  &:not(.is-disabled)
    +link-color(#456)
    cursor: pointer

  &.is-disabled
    color: rgba(#123, 0.3)
    outline: none

  &.is-active
    background: rgba(#acb1b4, 0.25)

  &:before
    +shikimori

  $icons: ("strong": "\e802", "em": "\e804", "underline": "\e807", "deleted": "\e805", "link": "🔗", "code_inline": "\ef53", "undo": "\ebb0", "redo": "\ebaf", "image": "\e81d", "bullet_list": "\ebab", "blockquote": "\e80b", "code_block": "\ebac")
  @each $name, $glyph in $icons
    &.#{$name}:before
      content: $glyph
</style>
