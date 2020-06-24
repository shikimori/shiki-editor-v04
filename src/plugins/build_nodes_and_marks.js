import {
  Blockquote,
  BulltList,
  Center,
  CodeBlock,
  Div,
  Doc,
  Hr,
  Image,
  LinkBlock,
  ListItem,
  Paragraph,
  Quote,
  Right,
  SpoilerBlock,
  SizeBlock,
  Text
} from '../nodes';

import {
  CodeInline,
  Color,
  Strike,
  Italic,
  LinkInline,
  SizeInline,
  SpoilerInline,
  Bold,
  Underline
} from '../marks';

export default function(editor) {
  return [
    new Doc(),
    new Text(),
    new Paragraph(),
    new SpoilerInline(), // must be above other marks in order to obtain greater priorirty
    new LinkInline(),
    new Bold(),
    new Italic(),
    new Color(),
    new SizeInline(),
    new Underline(),
    new Strike(),
    new CodeInline(),
    new Center(),
    new Right(),
    new LinkBlock(),
    new SizeBlock(),
    new Blockquote(),
    new BulltList(),
    new CodeBlock(),
    new Div(),
    new Hr(),
    new Image(),
    new ListItem(),
    new Quote({ baseUrl: editor.options.baseUrl }),
    new SpoilerBlock()
  ];
}
