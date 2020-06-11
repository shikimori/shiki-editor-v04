<template>
  <div class='container'>
    <div class='fc-2'>
      <div class='f-column'>
        <Editor
          :content='text1'
          @update='(value) => text1 = value'
        />
        <textarea v-model='text1' rows='10' />
      </div>
      <div class='f-column'>
        <Editor
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

export default {
  name: 'App',
  components: {
    Editor
  },
  data: () => ({
    text1: `qwe
123 [img]https://kawai.shikimori.one/system/users/x160/1.png?1591612283[/img] 456
zxc
[img]https://s1.1zoom.ru/big3/276/376565-alexfas01.jpg[/img]`,
    text2: `aa [u]te[/u]st
test0[i]test1[b]test2[/b]test3[/i]test4[s]test5[/s]test6\`test7\`
\`\`\`
code block
\`\`\`
zzz
[img]https://kawai.shikimori.one/system/characters/original/166521.jpg?1591393014[/img]
xxx
\`\`\`css
css code block
\`\`\`
before \`inline code\` after
- abc
- def
> - test
- > nope

test

> n[b]op[/b]e
> > nope
> yes`
  })
};
</script>

<style scoped lang='sass'>
textarea
  margin-top: 30px
  width: 100%
</style>
