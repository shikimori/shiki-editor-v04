import {
  Blockquote,
  BulltList,
  Center,
  CodeBlock,
  Div,
  Doc,
  Image,
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
  Link,
  Size,
  SpoilerInline,
  Strong,
  Underline
} from '../marks';

export default function(editor) {
  return [
    new Doc(),
    new Text(),
    new Paragraph(),
    new SpoilerInline(), // must be above other marks in order to obtain greater priorirty
    new Link(),
    new Strong(),
    new Em(),
    new Color(),
    new Size(),
    new Underline(),
    new Deleted(),
    new CodeInline(),
    new Center(),
    new Right(),
    new Blockquote(),
    new BulltList(),
    new CodeBlock(),
    new Div(),
    new Image(),
    new ListItem(),
    new Quote({ baseUrl: editor.options.baseUrl }),
    new SpoilerBlock()
  ];
}
