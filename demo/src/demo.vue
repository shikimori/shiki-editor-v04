<template>
  <div class='container'>
    <div class='fc-2'>
      <div class='f-column'>
        <Editor
          ref='editor1'
          :content='text1'
          :base-url='baseUrl'
          @update='(value) => text1 = value'
        />
      </div>
      <div v-if='isColumn2' class='f-column'>
        <Editor
          ref='editor2'
          :content='text2'
          :base-url='baseUrl'
          @update='(value) => text2 = value'
        />
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
    baseUrl: 'https://shikimori.one',
    text1: `zxc
[spoiler=spoiler block with label]
spoiler content
[/spoiler]
[spoiler]
spoiler content
[/spoiler]
`,
    isColumn2: true,
    text2: `B[b]old tex[/b]t
I[i]talic tex[/i]t
U[u]nderlined tex[/u]t
S[s]triked tex[/s]t
C\`ode tex\`t
L[url=https://github.com/shikimori/shiki-editor]ink tex[/url]t
[spoiler=spoiler block with label]
spoiler content
[/spoiler]
[spoiler]
spoiler content
[/spoiler]
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

Image
[img]https://kawai.shikimori.one/system/characters/original/166521.jpg?1591393014[/img] test [img]https://kawai.shikimori.one/system/users/x160/1.png?1591612283[/img]
Poster
[poster]https://www.ljmu.ac.uk/~/media/ljmu/news/starsedit.jpg[/poster]

[quote]Old style quote support[/quote]
[quote=zxc]Old style quote with nickname[/quote]
[quote=c1246;1945;Silentium°]Old style quote with user[/quote]`
  }),
  mounted() {
    window.markdownTokenizer = markdownit('commonmark', { html: false });
    window.shikiTokenizer = this.$refs.editor1.editor.markdownParser.tokenizer;
  }
};
</script>

<style scoped lang='sass'>
.f-column:first-child:last-child
  width: 100%
</style>
