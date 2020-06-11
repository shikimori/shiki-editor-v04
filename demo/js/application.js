import delay from 'delay';
import markdownit from 'markdown-it';
import ShikiEditor from '../../src/editor';

window.I18n = {
  t: key => `:${key}`
};

window.markdownTokenizer = markdownit('commonmark', { html: false });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.editor-container').forEach(async container => {
    const node = container.querySelector('.prosemirror-container');
    const textarea = container.querySelector('textarea');

    // const { Vue } = await import(/* webpackChunkName: "vue" */ 'vue');
    // const App = await import('../../src/vue/app.vue');
    // 
    // const _app = new Vue({
    //   el: node,
    //   render: h => h(App)
    // });


    // const editor = new ShikiEditor({ node, content: textarea.value });
    // editor.on('update', () => textarea.value = editor.exportMarkdown());
    // 
    // const onTextareaKeypress = () =>
    //   delay().then(() => editor.setContent(textarea.value));
    // 
    // textarea.addEventListener('keypress', onTextareaKeypress);
    // textarea.addEventListener('keydown', onTextareaKeypress);
    // textarea.addEventListener('paste', onTextareaKeypress);
  });
});
