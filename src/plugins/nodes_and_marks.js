import {
  Doc,
  Text,
  Paragraph,
  Blockquote,
  BulltList,
  SpoilerBlock,
  CodeBlock,
  Image,
  ListItem,
  Quote
} from '../nodes';

import {
  SpoilerInline,
  Link,
  Strong,
  Em,
  Underline,
  Deleted,
  CodeInline
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
    new Blockquote(),
    new BulltList(),
    new SpoilerBlock(),
    new CodeBlock(),
    new Image(),
    new ListItem(),
    new Quote({ baseUrl: editor.options.baseUrl })
  ];
}
