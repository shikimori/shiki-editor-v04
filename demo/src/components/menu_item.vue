<template>
  <button
    class='icon'
    title='title'
  >
    {{ type }}
  </button>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    type: { type: String, required: true }
  },
  computed: {
    title() {
      return I18n.t(`frontend.shiki_editor.${this.type}`);
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
