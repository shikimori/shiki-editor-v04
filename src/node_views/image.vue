<template>
  <span
    class='b-image no-zoom'
    :class='{
      "is-prosemirror-selected": selected,
      "b-poster": isPoster,
      "check-width": !isPoster
    }'
    :data-src='node.attrs.src'
    @click='select'
  >
    <div class='controls'>
      <div v-if='isPoster' class='collapse' @click='collapse' />
      <div v-else class='expand' @click='expand' />
      <div class='delete' @click='remove' />
    </div>
    <img ref='image' :src='node.attrs.src'>
  </span>
</template>

<script>
import { NodeSelection } from 'prosemirror-state';

export default {
  name: 'ImageView',
  props: {
    node: { type: Object, required: true },
    getPos: { type: Function, required: true },
    view: { type: Object, required: true },
    selected: { type: Boolean, required: true },
    updateAttrs: { type: Function, required: true }
  },
  computed: {
    isPoster() {
      return this.node.attrs.isPoster;
    }
  },
  methods: {
    remove(e) {
      e.stopImmediatePropagation();

      this.view.dispatch(
        this.view.state.tr.delete(
          this.getPos(),
          this.getPos() + 1
        )
      );
    },
    select() {
      this.view.dispatch(
        this.view.state.tr.setSelection(
          new NodeSelection(this.view.state.tr.doc.resolve(this.getPos()))
        )
      );
    },
    expand() {
      this.updateAttrs({ ...this.node.attrs, isPoster: true });

      // NOTE: example with transaction
      // this.view.dispatch(
      //   this.view.state.tr.setNodeMarkup(
      //     this.getPos(),
      //     null,
      //     { ...this.node.attrs, isPoster: true }
      //   )
      // );
    },
    collapse() {
      this.updateAttrs({ ...this.node.attrs, isPoster: false });
    }
  }
};
</script>

<style scoped lang='sass'>
.b-image
  &:hover,
  &.is-prosemirror-selected
    outline: 2px solid #8cf
    z-index: 9

    &:after,
    &:before
      bottom: 0
      content: ''
      left: 0
      position: absolute
      right: 0
      top: 0

    &:before
      border: 1px solid rgba(#000, 0.5)

    &:after
      border: 1px solid rgba(#fff, 0.5)

    img
      opacity: 1

    .controls
      display: flex
      top: 1px
      right: 1px

  img
    transition: max-width .25s
</style>
