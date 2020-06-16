<template>
  <button
    class='menu-item'
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
  },
};
</script>

<style scoped lang='sass'>
@import @/stylesheets/core

.menu-item
  -webkit-appearance: none
  border: none
  background: transparent
  margin: 0 4px
  padding: 0
  width: 19px
  height: 19px
  font-size: 14px

  &:not(.is-disabled)
    +link-color(#456)
    cursor: pointer

  &.is-disabled
    color: rgba(#123, 0.3)

  &.is-active
    background: rgba(#acb1b4, 0.25)

  &:before
    +shikimori

  $icons: ("strong": "\e802", "em": "\e804", "underline": "\e807", "deleted": "\e805", "blockquote": "\e80b")
  @each $name, $glyph in $icons
    &.#{$name}:before
      content: $glyph
</style>
