import {
  Doc,
  Text,
  Paragraph,
  Center,
  Right,
  Blockquote,
  BulltList,
  CodeBlock,
  Div,
  Image,
  ListItem,
  Quote,
  SpoilerBlock
} from '../nodes';

import {
  CodeInline,
  Deleted,
  Em,
  Link,
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
