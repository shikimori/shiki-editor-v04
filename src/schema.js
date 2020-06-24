// https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/schema.js
//
// // ::Schema Document schema for the data model used by CommonMark.
// export const schema = new Schema({
//   nodes: {
//     doc: {
//       content: "block+"
//     },
//
//     paragraph: {
//       content: "inline*",
//       group: "block",
//       parseDOM: [{tag: "p"}],
//       toDOM() { return ["p", 0] }
//     },
//
//     blockquote: {
//       content: "block+",
//       group: "block",
//       parseDOM: [{tag: "blockquote"}],
//       toDOM() { return ["blockquote", 0] }
//     },
//
//     horizontal_rule: {
//       group: "block",
//       parseDOM: [{tag: "hr"}],
//       toDOM() { return ["div", ["hr"]] }
//     },
//
//     heading: {
//       attrs: {level: {default: 1}},
//       content: "(text | image)*",
//       group: "block",
//       defining: true,
//       parseDOM: [{tag: "h1", attrs: {level: 1}},
//                  {tag: "h2", attrs: {level: 2}},
//                  {tag: "h3", attrs: {level: 3}},
//                  {tag: "h4", attrs: {level: 4}},
//                  {tag: "h5", attrs: {level: 5}},
//                  {tag: "h6", attrs: {level: 6}}],
//       toDOM(node) { return ["h" + node.attrs.level, 0] }
//     },
//
//     ordered_list: {
//       content: "list_item+",
//       group: "block",
//       attrs: {order: {default: 1}, tight: {default: false}},
//       parseDOM: [{tag: "ol", getAttrs(dom) {
//         return {order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1,
//                 tight: dom.hasAttribute("data-tight")}
//       }}],
//       toDOM(node) {
//         return ["ol", {start: node.attrs.order == 1 ? null : node.attrs.order,
//                        "data-tight": node.attrs.tight ? "true" : null}, 0]
//       }
//     },
//
//     bullet_list: {
//       content: "list_item+",
//       group: "block",
//       attrs: {tight: {default: false}},
//       parseDOM: [{tag: "ul", getAttrs: dom => ({tight: dom.hasAttribute("data-tight")})}],
//       toDOM(node) { return ["ul", {"data-tight": node.attrs.tight ? "true" : null}, 0] }
//     },
//
//     list_item: {
//       content: "paragraph block*",
//       defining: true,
//       parseDOM: [{tag: "li"}],
//       toDOM() { return ["li", 0] }
//     },
//
//     text: {
//       group: "inline"
//     },
//
//     image: {
//       inline: true,
//       attrs: {
//         src: {},
//         alt: {default: null},
//         title: {default: null}
//       },
//       group: "inline",
//       draggable: true,
//       parseDOM: [{tag: "img[src]", getAttrs(dom) {
//         return {
//           src: dom.getAttribute("src"),
//           title: dom.getAttribute("title"),
//           alt: dom.getAttribute("alt")
//         }
//       }}],
//       toDOM(node) { return ["img", node.attrs] }
//     },
//
//     hard_break: {
//       inline: true,
//       group: "inline",
//       selectable: false,
//       parseDOM: [{tag: "br"}],
//       toDOM() { return ["br"] }
//     }
//   },
//
//   marks: {
//     em: {
//       parseDOM: [{tag: "i"}, {tag: "em"},
//                  {style: "font-style", getAttrs: value => value == "italic" && null}],
//       toDOM() { return ["em"] }
//     },
//
//     bold: {
//       parseDOM: [{tag: "b"}, {tag: "bold"},
//                  {style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null}],
//       toDOM() { return ["bold"] }
//     },
//
//     link: {
//       attrs: {
//         href: {},
//         title: {default: null}
//       },
//       inclusive: false,
//       parseDOM: [{tag: "a[href]", getAttrs(dom) {
//         return {href: dom.getAttribute("href"), title: dom.getAttribute("title")}
//       }}],
//       toDOM(node) { return ["a", node.attrs] }
//     },
//
//     code: {
//       parseDOM: [{tag: "code"}],
//       toDOM() { return ["code"] }
//     }
//   }
// })
