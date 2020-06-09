import delay from 'delay';
import markdownit from 'markdown-it';
import ShikiEditor from '../../src/editor';

window.I18n = {
  t: key => `:${key}`
};

window.markdownTokenizer = markdownit('commonmark', { html: false });

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.editor-container').forEach(container => {
    const node = container.querySelector('.prosemirror-container');
    const textarea = container.querySelector('textarea');

    const editor = new ShikiEditor({ node, content: textarea.value });
    editor.on('update', () => textarea.value = editor.exportMarkdown());

    const onTextareaKeypress = () =>
      delay().then(() => editor.setContent(textarea.value));

    textarea.addEventListener('keypress', onTextareaKeypress);
    textarea.addEventListener('keydown', onTextareaKeypress);
    textarea.addEventListener('paste', onTextareaKeypress);
  });
});
