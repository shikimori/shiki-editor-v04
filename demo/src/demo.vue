<template>
  <div class='container'>
    <div class='samples'>
      <label><input v-model='isColumn1' type='checkbox'>Sample 1</label>
      <label><input v-model='isColumn2' type='checkbox'>Sample 2</label>
    </div>

    <div class='fc-2'>
      <div v-if='isColumn1' class='f-column'>
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
import Editor from '../../src/editor_app';
import markdownit from 'markdown-it';

export default {
  name: 'App',
  components: {
    Editor
  },
  data: () => ({
    baseUrl: 'https://shikimori.one',
    isColumn1: false,
    isColumn2: true,
    // text2: `[center] [url=ya.ru][quote][b]www[/b][/quote]
    text2: `[hr]
[spoiler=MV]
z
[/spoiler]
`,
//     text2: `[div=c-column b-catalog_entry][div=cover][div=image-decor][anime=1292][div=image-cutter]
// [poster]https://kawai.shikimori.one/system/animes/original/1292.jpg?1578039620[/poster][/div][/anime][div=text]
// 1
// [/div][/div][/div][/div]
// `,
    text1: `B[b]old tex[/b]t
I[i]talic tex[/i]t
U[u]nderlined tex[/u]t
S[s]triked tex[/s]t
Inline c\`ode tex\`t
Inline s||poiler tex||t    \`||spoiler content||\`
C[color=red]olored tex[/color]t   \`[color=red]...[/color]\`
s[size=18]ized tex[/size]t   \`[size=18]...[/size]\`
L[url=https://github.com/shikimori/shiki-editor]ink tex[/url]t
[spoiler=spoiler block with label]
spoiler \`content\`
[/spoiler]
[spoiler]
spoiler content
[/spoiler]

[hr]

Custom DIV
\`[div=fc-2][div=f-column][/div][div=f-column][/div][/div]\`

[div=fc-2]
[div=f-column]
\`[div=f-column]\`
[/div]
[div=f-column]
\`[div=f-column]\`
[/div]
[/div]

[hr]

[right]\`[right]...[/right]\`[/right]
[center]\`[center]...[/center]\`[/center]

[hr]

\`\`\`
code block
\`\`\`
\`\`\`css
css code block
\`\`\`
- Bulet List
- def
> - \`quoted\` list
- > list \`quoted\`

> Quote
> > nope
> yes

Image
[img no-zoom 225x317]https://kawai.shikimori.one/system/animes/original/38481.jpg?1592053805[/img]     [img no-zoom width=200]https://kawai.shikimori.one/system/animes/original/38481.jpg?1592053805[/img]     [img]https://kawai.shikimori.one/system/animes/original/38481.jpg?1592053805[/img] [img]https://kawai.shikimori.one/system/users/x160/1.png?1591612283[/img]
Poster
[poster]https://www.ljmu.ac.uk/~/media/ljmu/news/starsedit.jpg[/poster]

[div=b-link_button]
\`[div=b-link_button]...[/div]\`
[/div]

div [div=b-link_button]inside line is not parsed[/div]

[quote]Old style quote support[/quote]
[quote=zxc]Old style quote with nickname[/quote]
[quote=c1246;1945;Silentium°]Old style quote with user[/quote]`,
  }),
  mounted() {
    window.markdownTokenizer = markdownit('commonmark', { html: false });
    window.shikiTokenizer = (this.$refs.editor1 || this.$refs.editor2)
      .editor.markdownParser.tokenizer;
  }
};
</script>

<style scoped lang='sass'>
.f-column:first-child:last-child
  width: 100%

.samples
  margin-bottom: 16px

  label
    display: inline-flex
    margin-right: 16px
    align-items: center

    input
      margin-right: 5px
</style>
