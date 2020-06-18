export default class SpoilerInlineView {
  constructor(node, view, _getPos, _decorations) {
    this.node = node;
    this.view = view;

    this.dom = document.createElement('span');
    this.contentDOM = document.createElement('span');

    this.dom.classList.add('b-spoiler_inline');
    if (node.attrs.isOpened) {
      this.dom.classList.add('is-opened');
    }
    this.dom.addEventListener('click', this.toggle.bind(this));
    this.dom.appendChild(this.contentDOM);
  }

  toggle() {
    this.dom.classList.toggle('is-opened');
  }
}
