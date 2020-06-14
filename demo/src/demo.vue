<template>
  <div class='container'>
    <div class='fc-2'>
      <div class='f-column'>
        <Editor
          ref='editor1'
          :content='text1'
          @update='(value) => text1 = value'
        />
        <textarea v-model='text1' rows='10' />
      </div>
      <div v-if='isColumn2' class='f-column'>
        <Editor
          ref='editor2'
          :content='text2'
          @update='(value) => text2 = value'
        />
        <textarea v-model='text2' rows='10' />
      </div>
    </div>
  </div>
</template>

<script>
import Editor from './components/editor';
import markdownit from 'markdown-it';

export default {
  name: 'App',
  components: {
    Editor
  },
  data: () => ({
    text1: `test
`,
    isColumn2: true,
    text2: `B[b]old tex[/b]t
I[i]talic tex[/i]t
U[u]nderlined tex[/u]t
S[s]triked tex[/s]t
C\`ode tex\`t
L[url=https://github.com/shikimori/shiki-editor]ink tex[/url]t
Image
[img]https://kawai.shikimori.one/system/characters/original/166521.jpg?1591393014[/img] test [img]https://kawai.shikimori.one/system/users/x160/1.png?1591612283[/img]
\`\`\`
code block
\`\`\`
\`\`\`css
css code block
\`\`\`
- Bulet List
- def
> - quoted list
- > list quoted

> Quote
> > nope
> yes

[quote]Old style quote support[/quote]
[quote=c1246;1945;Silentium°]Old style quote with author support[/quote]`
  }),
  mounted() {
    window.markdownTokenizer = markdownit('commonmark', { html: false });
    window.shikiTokenizer = this.$refs.editor1.editor.markdownParser.tokenizer;
  }
};
</script>

<style scoped lang='sass'>
textarea
  margin-top: 30px
  width: 100%
</style>
