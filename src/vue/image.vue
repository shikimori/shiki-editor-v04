<template>
  <a class='b-image unprocessed' :href='node.attrs.src'>
    <div class='controls'><div class='delete' /></div>
    <img :src='node.attrs.src'>
  </a>
</template>

<script>
export default {
  props: {
    node: { type: Object, required: true },
    updateAttrs: { type: Function, required: true }
  },
  methods: {
    onChange() {
      debugger;
      // this.updateAttrs({
      //   done: !this.node.attrs.done,
      // })
    }
  }
};
</script>
