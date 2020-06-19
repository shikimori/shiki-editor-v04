export default class SpoilerBlockView {
  constructor(node, view, getPos, _decorations) {
    this.node = node;
    this.view = view;
    this.getPos = getPos;

    this.dom = document.createElement('div');
    this.contentDOM = document.createElement('div');

    this.dom.classList.add('b-spoiler_block');
    if (node.attrs.isOpened) {
      this.dom.classList.add('is-opened');
    }

    const button = document.createElement('button');
    button.innerText = node.attrs.label;
    button.addEventListener('click', this.toggle.bind(this));

    const edit = document.createElement('span');
    edit.classList.add('edit');
    edit.addEventListener('click', this.changeLabel.bind(this));

    this.dom.appendChild(button);
    this.dom.appendChild(edit);
    this.dom.appendChild(this.contentDOM);
  }

  // for some reason this fixes headline editing of closed spoiler
  // https://prosemirror.net/docs/ref/#view.NodeView.update
  update(_node, _decorations) {
    return false;
  }

  toggle() {
    const { getPos, node, view } = this;
    const { dispatch } = view;
    const { tr } = this.view.state;

    const attrs = {
      ...node.attrs,
      isOpened: !node.attrs.isOpened
    };

    dispatch(
      tr.setNodeMarkup(getPos(), null, attrs)
    );
    view.focus();
  }

  changeLabel() {
    const label = prompt(
      I18n.t('frontend.shiki_editor.prompt.spoiler_label'),
      this.node.attrs.label
    );
    if (!label) { return; }

    const { getPos, node, view } = this;
    const { dispatch } = view;
    const { tr } = this.view.state;


    const attrs = { ...node.attrs, label };

    dispatch(
      tr.setNodeMarkup(getPos(), null, attrs)
    );
    view.focus();
  }
}
