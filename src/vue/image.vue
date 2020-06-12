<template>
  <span
    class='b-image unprocessed no-zoom'
    :class='{ "is-prosemirror-selected": selected }'
    :data-src='node.attrs.src'
    @click='select'
  >
    <div class='controls'>
      <div class='delete' @click='remove' />
    </div>
    <img :src='node.attrs.src'>
  </span>
</template>

<script>
import { NodeSelection } from 'prosemirror-state';

export default {
  props: {
    node: { type: Object, required: true },
    getPos: { type: Function, required: true },
    view: { type: Object, required: true },
    selected: { type: Boolean, required: true }
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
    }
  }
};
</script>

<style scoped>
.b-image:hover,
.b-image.is-prosemirror-selected {
  outline: 2px solid #1d78b7;
  z-index: 10;
}
.b-image:hover:before,
.b-image.is-prosemirror-selected:before {
  border: 1px solid rgba(255, 255, 255, 0.5);
  bottom: 0;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
}

.b-image:hover .controls,
.b-image.is-prosemirror-selected .controls {
  display: block;
}
</style>
