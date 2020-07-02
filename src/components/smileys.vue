<template>
  <div>
    <div ref='container' class='smileys'>
      <div ref='arrow' class='arrow' />
      <div v-if='smileysHTML' class='inner' v-html='smileysHTML' />
      <div v-else class='b-ajax' />
    </div>
    <div class='shade' @click='close' />
  </div>
</template>

<script>
// import { createPopper } from '@popperjs/core';
import { createPopper } from '@popperjs/core/lib/popper-lite';
import preventOverflow from '@popperjs/core/lib/modifiers/preventOverflow';
import offset from '@popperjs/core/lib/modifiers/offset';
import arrow from '@popperjs/core/lib/modifiers/arrow';

import axios from 'axios';
// import flip from '@popperjs/core/lib/modifiers/flip';

const SMILEYS_PATH = 'comments/smileys';

export default {
  name: 'Smileys',
  props: {
    baseUrl: { type: String, required: true },
    isEnabled: { type: Boolean, required: true },
    targetRef: { type: String, required: true }
  },
  data: () => ({
    popper: null,
    smileysHTML: null
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
          modifiers: [preventOverflow, offset, arrow, {
            name: 'preventOverflow',
            options: { padding: 10 }
          }, {
            name: 'offset',
            options: { offset: [0, 8] }
          }, {
            name: 'arrow',
            options: { element: this.$refs.arrow }
          }]
        }
      );
      if (!this.smileysHTML) {
        this.fetch();
      }
    },
    hide() {
      this.popper.destroy();
      this.popper = null;
    },
    async fetch() {
      const { data } = await axios.get(`${this.baseUrl}/${SMILEYS_PATH}`);
      this.smileysHTML = data.replace(/src="\//g, `src="${this.baseUrl}/`);
    },
    close() {
      this.$emit('toggle');
    }
  }
};
</script>

<style scoped lang='sass'>
@import ../stylesheets/responsive.sass

$padding-horizontal: 10px
$padding-vertical: 8px

.smileys
  background: #fff
  padding: $padding-vertical $padding-horizontal
  font-size: 13px
  /* border: 1px solid #ddd */
  position: relative
  z-index: 20

  +lte_ipad
    width: 280px

  +gte_laptop
    width: 492px
    min-height: 472px

  /deep/ .smiley
    cursor: pointer
    margin-right: 4px
    margin-bottom: 6px

  &[data-popper-placement^='top'] > .arrow
    bottom: -4px
  &[data-popper-placement^='bottom'] > .arrow
    top: -4px
  &[data-popper-placement^='left'] > .arrow
    right: -4px
  &[data-popper-placement^='right'] > .arrow
    left: -4px

.b-ajax
  width: calc(100% - #{$padding-horizontal * 2})
  height: calc(100% - #{$padding-horizontal * 2})
  position: absolute

.arrow
  height: 8px
  width: 8px

  &::before
    /* border: 1px solid #ddd */
    /* border-bottom: none    */
    /* border-right: none     */
    background: #fff
    content: ''
    height: 100%
    transform: rotate(45deg)
    width: 100%
    position: absolute
    z-index: -1

.shade
  background: rgba(#061b42, 0.35)
  height: 100%
  left: 0
  position: fixed
  top: 0
  width: 100%
  z-index: 19
</style>
