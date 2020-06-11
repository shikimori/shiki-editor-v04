<template>
  <div class='test'>test</div>
</template>

<script>
import { Editor } from '../editor';
import { EditorContent } from './editor_content';

export default {
  components: {
    EditorContent
  },
  data() {
    return {};
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>

<style scoped>
.test {
  font-size: 20px;
  color: red;
}
</style>
