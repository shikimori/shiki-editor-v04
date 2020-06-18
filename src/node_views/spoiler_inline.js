import { updateMark } from '../commands';
import { getMarkRange } from '../utils';

export default class SpoilerInlineView {
  constructor(mark, view) {
    this.mark = mark;
    this.view = view;

    this.dom = document.createElement('span');
    this.contentDOM = document.createElement('span');

    this.dom.classList.add('b-spoiler_inline');
    if (mark.attrs.isOpened) {
      this.dom.classList.add('is-opened');
    }
    this.dom.addEventListener('click', this.toggle.bind(this));
    this.dom.appendChild(this.contentDOM);
  }

  toggle() {
    const { dispatch } = this.view;
    const { tr } = this.view.state;

    const attrs = { ...this.mark.attrs, isOpened: !this.mark.attrs.isOpened };
    const type = this.mark.type;

    const range = getMarkRange(this.view.state.selection.$from, type);

    dispatch(
      tr.addMark(range.from, range.to, type.create(attrs))
    );
  }
}
