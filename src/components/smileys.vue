<template>
  <div ref='container' class='smileys'>
    smileys
  </div>
</template>

<script>
// import { createPopper } from '@popperjs/core';
import { createPopper } from '@popperjs/core/lib/popper-lite';

export default {
  name: 'Smileys',
  props: {
    baseUrl: { type: String, required: true },
    isEnabled: { type: Boolean, required: true },
    targetRef: { type: String, required: true }
  },
  data: () => ({
    popper: null
  }),
  watch: {
    isEnabled() {
      if (this.isEnabled) {
        this.show();
      } else {
        this.hide();
      }
    }
  },
  mounted() {
    if (this.isEnabled) {
      this.show();
    }
  },
  methods: {
    show() {
      this.popper = createPopper(
        this.$parent.$refs[this.targetRef][0].$el,
        this.$refs.container,
        {
          placement: 'bottom',
          modifiers: [{
            name: 'preventOverflow',
            options: {
              padding: 10
            }
          }]
        }
      );
    },
    hide() {
      this.popper.destroy();
      this.popper = null;
    }
  }
};
</script>

<style scoped lang='sass'>
@import ../stylesheets/responsive.sass

.smileys
  background: red

  +lte_ipad
    width: 280px

  +gte_laptop
    width: 732px
</style>
