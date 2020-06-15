<template>
  <button
    class='menu-item'
    :title='title'
    :class='{ "is-active": isActive }'
    @click='itemCommand'
  >
    {{ type }} {{ isActive }}
  </button>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    type: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    command: { type: Function, required: true }
  },
  computed: {
    title() {
      return I18n.t(`frontend.shiki_editor.${this.type}`);
    }
  },
  methods: {
    itemCommand() {
      this.command();
    }
  }
};
</script>

<style scoped lang='sass'>
</style>
