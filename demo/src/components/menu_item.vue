<template>
  <button
    class='menu-item'
    :title='title'
    :class='{
      "is-active": isActive,
      "is-disabled": !isEnabled
    }'
    @click='command'
  >
    {{ title }} {{ isActive }}
  </button>
</template>

<script>
export default {
  name: 'MenuItem',
  props: {
    title: { type: String, required: true },
    command: { type: Function, required: true },
    isActive: { type: Boolean, required: true },
    isEnabled: { type: Boolean, required: false, default: true }
  },
};
</script>

<style scoped lang='sass'>
</style>
