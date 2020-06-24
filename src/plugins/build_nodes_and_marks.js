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
  Text
} from '../nodes';

import {
  CodeInline,
  Color,
  Deleted,
  Em,
  LinkInline,
  Size,
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
    new Em(),
    new Color(),
    new Size(),
    new Underline(),
    new Deleted(),
    new CodeInline(),
    new Center(),
    new Right(),
    new LinkBlock(),
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
