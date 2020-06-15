import {
  Doc,
  Text,
  Paragraph,
  Blockquote,
  BulltList,
  CodeBlock,
  Image,
  ListItem,
  Quote
} from '../nodes';

import {
  Strong,
  Em,
  Underline,
  Deleted,
  CodeInline,
  Link
} from '../marks';

export default function(editor) {
  return [
    new Doc(),
    new Text(),
    new Paragraph(),
    new Strong(),
    new Em(),
    new Link(),
    new Underline(),
    new Deleted(),
    new CodeInline(),
    new Blockquote(),
    new BulltList(),
    new CodeBlock(),
    new Image(),
    new ListItem(),
    new Quote({ baseUrl: editor.options.baseUrl })
  ];
}
