<template>
  <a class='b-image unprocessed' :href='node.attrs.src'>
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
    view: { type: Object, required: true }
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
