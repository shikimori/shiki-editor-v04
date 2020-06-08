// import delay from 'delay';
//
// import { EditorState } from 'prosemirror-state';
// import { EditorView } from 'prosemirror-view';
// import { shikiMarkdownParser } from '../../src/markdown/from_markdown';
// import { shikiMarkdownSerializer } from '../../src/markdown/to_markdown';
// import { Tokenizer } from '../../src/markdown/tokenizer';
// import { plugins } from '../../src/plugins';
// import { schema } from '../../src/schema';
//
// import markdownit from 'markdown-it';
//
// const markdownParserTokenizer = markdownit('commonmark', { html: false });
// window.markdownParserTokenizer = markdownParserTokenizer;
// window.Tokenizer = Tokenizer;
import ShikiEditor from '../../src/editor';

window.I18n = {
  t: key => `:${key}`
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.editor-container').forEach(container => {
    const node = container.querySelector('.prosemirror-container');
    const textarea = container.querySelector('textarea');

    const editor = new ShikiEditor({ node, content: textarea.value });

    editor.on('update', () => textarea.value = editor.exportMarkdown());
  });
});
// document.addEventListener('DOMContentLoaded', () => {
//   document.querySelectorAll('.editor-container').forEach(container => {
//     const editor = container.querySelector('.prosemirror-container');
//     const textarea = container.querySelector('textarea');
//
//     const view = new EditorView(editor, {
//       state: EditorState.create({
//         schema,
//         plugins,
//         doc: shikiMarkdownParser.parse(textarea.value)
//       }),
//       // doc: DOMParser.fromSchema(mySchema).parse(this.$textarea[0]),
//       dispatchTransaction: transaction => {
//         const { state, transactions } = view.state.applyTransaction(transaction);
//         view.updateState(state);
//
//         if (transactions.some(tr => tr.docChanged)) {
//           const markdown = shikiMarkdownSerializer.serialize(state.doc);
//           // console.log(Tokenizer.parse(markdown));
//           textarea.value = markdown;
//         }
//       }
//     });
//
//     const onTextareaKeypress = async () => {
//       await delay();
//
//       view.updateState(
//         EditorState.create({
//           schema,
//           plugins,
//           doc: shikiMarkdownParser.parse(textarea.value)
//         })
//       );
//     };
//
//     textarea.addEventListener('keypress', onTextareaKeypress);
//     textarea.addEventListener('keydown', onTextareaKeypress);
//     textarea.addEventListener('paste', onTextareaKeypress);
//   });
// });
