import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { shikiMarkdownParser } from '../../src/markdown/from_markdown';
import { shikiMarkdownSerializer } from '../../src/markdown/to_markdown';
import { Tokenizer } from '../../src/markdown/tokenizer';
import { plugins } from '../../src/plugins';
import { schema } from '../../src/schema';

import markdownit from 'markdown-it';
const markdownTokenizer = markdownit('commonmark', { html: false });
window.markdownTokenizer = markdownTokenizer;
window.Tokenizer = Tokenizer;

const I18n = { // eslint-disable-line no-unused-vars
  t: key => key
};

// document.querySelectorAll('.editor-container').forEach(container => {
//   const editor = container.querySelector('.editor-container');
//   const textarea = container.querySelector('textarea');
// 
//   const view = new EditorView(edito, {
//     state: EditorState.create({
//       schema,
//       plugins,
//       doc: shikiMarkdownParser.parse(this.text)
//     }),
//     // doc: DOMParser.fromSchema(mySchema).parse(this.$textarea[0]),
//     dispatchTransaction: transaction => {
//       const { state, transactions } = view.state.applyTransaction(transaction);
//       view.updateState(state);
// 
//       if (transactions.some(tr => tr.docChanged)) {
//         const markdown = shikiMarkdownSerializer.serialize(state.doc);
//         // console.log(Tokenizer.parse(markdown));
//         this.$textarea.val(markdown);
//       }
//     }
//   });
// 
//   // this.$textarea.on('keypress keydown paste', async () => {
//   //   await delay();
//   //
//   //   view.updateState(
//   //     EditorState.create({
//   //       schema,
//   //       plugins,
//   //       doc: shikiMarkdownParser.parse(this.text)
//   //     })
//   //   );
//   // });
// });
    // view.focus();
    // const domSerializer = DOMSerializer.fromSchema(schema);
    // const xmlSerializer = new XMLSerializer();
    // const exportHTML = () => {
    //   const fragment = domSerializer.serializeFragment(view.state.doc.content);
    //   output.textContent = xmlSerializer.serializeToString(fragment);
    // };
    // exportHTML();

    // const mySchema = new Schema({
    //   nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
    //   marks: schema.spec.marks
    // });
    //
    // const editor = new EditorView(this.$('.prosemirror')[0], {
    //   state: EditorState.create({
    //     doc: DOMParser.fromSchema(mySchema).parse(this.$textarea[0]),
    //     plugins: exampleSetup({ schema: mySchema })
    //   })
    // });
    // window.view = editor;
    // return editor;
  // }
// }

// import { DOMSerializer } from 'prosemirror-model';

// import { EditorState } from 'prosemirror-state';
// import { EditorView } from 'prosemirror-view';
// import { Schema, DOMParser } from 'prosemirror-model';
// import { schema } from 'prosemirror-schema-basic';
// import { addListNodes } from 'prosemirror-schema-list';
// import { exampleSetup } from 'prosemirror-example-setup';

