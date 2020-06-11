<template>
  <a
    class='b-image unprocessed'
    :class='{ "is-prosemirror-selected": selected }'
    :href='node.attrs.src'
  >
    <div class='controls'>
      <div class='delete' @click='remove' />
    </div>
    <img :src='node.attrs.src'>
  </a>
</template>

<script>
export default {
  props: {
    node: { type: Object, required: true },
    getPos: { type: Function, required: true },
    view: { type: Object, required: true },
    selected: { type: Boolean, required: true }
  },
  methods: {
    remove(e) {

      e.preventDefault();
      const position = this.getPos();
      this.view.dispatch(
        this.view.state.tr.delete(position, position + 1)
      );
    }
  }
};
</script>

<style scoped>
.b-image:hover,
.b-image.is-prosemirror-selected {
  outline: 3px solid #2b8acc;
  z-index: 10;
}
.b-image:hover .controls,
.b-image.is-prosemirror-selected .controls {
  display: block;
}

.b-image:hover img,
.b-image.is-prosemirror-selected img {
  opacity: 1 !important;
}
</style>
