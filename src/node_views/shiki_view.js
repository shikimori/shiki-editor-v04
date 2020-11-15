import { bind } from 'shiki-decorators';
import { DOMSerializer } from 'prosemirror-model';

import DOMView from './dom_view';
import { getShikiLoader } from '../utils';

export default class ShikiView extends DOMView {
  constructor(options) {
    super(options);

    this.dom = document.createElement(this.elementType);
    this.dom.classList.add('b-shiki_editor-node');
    this.dom.setAttribute('data-attrs', JSON.stringify(this.node.attrs));

    this.syncState();
    this.appendContent();

    if (this.node.attrs.isLoading) {
      this.fetch();
    }

    this.dom.addEventListener('click', this.handleClick);
  }

  get type() {
    return this.node.attrs.type;
  }

  get elementType() {
    return this.isInline ? 'span' : 'div';
  }

  get isInline() {
    return this.extension.schema.group === 'inline';
  }

  get shikiLoader() {
    return getShikiLoader(this.editor);
  }

  async appendContent() {
    const domSerializer = DOMSerializer.fromSchema(this.editor.schema);

    if (this.isInline) {
      this.appendInlineContent(domSerializer);
    } else {
      this.appendBlockContent(domSerializer);
    }
  }

  appendSpanContent(domSerializer) {
    if (this.node.attrs.text && !this.node.attrs.isPasted) {
      this.dom.appendChild(
        domSerializer.serializeFragment(this.node.content)
      );
    } else {
      this.dom.innerText = this.node.attrs.bbcode;
    }
  }

  appendInlineContent(domSerializer) {
    if (this.node.attrs.text && !this.node.attrs.isPasted) {
      if (this.node.attrs.openBbcode) {
        this.dom.append(this.node.attrs.openBbcode);
      }
      this.dom.appendChild(
        domSerializer.serializeFragment(this.node.content)
      );
      if (this.node.attrs.closeBbcode) {
        this.dom.append(this.node.attrs.closeBbcode);
      }
    } else {
      this.dom.innerText = this.node.attrs.bbcode;
    }
  }

  appendBlockContent(domSerializer) {
    const content = document.createElement('div');

    content.appendChild(
      domSerializer.serializeFragment(this.node.content)
    );

    if (this.node.attrs.openBbcode) {
      const openBbcode = document.createElement('div');
      const closeBbcode = document.createElement('div');
      openBbcode.innerText = this.node.attrs.openBbcode;
      closeBbcode.innerText = this.node.attrs.closeBbcode;

      this.dom.appendChild(openBbcode);
      this.dom.appendChild(content);
      this.dom.appendChild(closeBbcode);
    } else {
      this.dom.appendChild(content);
    }
  }

  syncState() {
    const { dom, node } = this;
    const { attrs } = node;

    dom.classList.toggle('b-ajax', attrs.isLoading);
    dom.classList.toggle('vk-like', attrs.isLoading);
    dom.classList.toggle('is-error', attrs.isError);
    dom.classList.toggle('b-entry-404', attrs.isNotFound);
  }

  // rerender node view every time on any update
  update(node, decorations) {
    if (this.isInline) {
      return super.update(node, decorations);
    }

    return false;
  }

  @bind
  handleClick() {
    if (this.node.attrs.isLoading) {
      this.updateAttrs({ isLoading: false }, false);
    } else if (this.node.attrs.isError) {
      this.updateAttrs({ isLoading: true, isError: false }, false);
      this.fetch();
    } else {
      this.focus();
    }
  }

  // @bind
  // resetCache() {
  //   this.shikiLoader.resetCache(this.node.attrs);
  //   this.updateAttrs({ isError: false });
  //   this.dom.removeEventListener('click', this.resetCache);
  // }

  async fetch() {
    const result = await this.shikiLoader.readCache(this.node.attrs) ||
      await this.shikiLoader.fetch(this.node.attrs);

    if (this.isDestroyed || !this.node.attrs.isLoading) { return; }

    if (result) {
      this.success(result);
    } else if (result === undefined) {
      // undefined means that error happened
      this.error();
    } else {
      this.notFound();
    }
  }

  success(result) {
    if (this.type === 'poster' || this.type === 'image') {
      this.replaceImage(result);
    } else if (this.node.attrs.text) {
      this.replaceFragment(result);
    } else if (this.isInline) {
      this.replaceDefaultLink(result);
    } else {
      this.replaceNode(result);
    }
  }

  replaceImage(result) {
    this.replaceWith(
      this.view.state.schema.nodes.image.create({
        id: result.id,
        src: result.url,
        isPoster: this.type === 'poster',
        ...this.node.attrs.meta
      }, null, this.node.marks),
      false
    );
  }

  replaceFragment(result) {
    const selection = this.nodeSelection;
    const content = this.node.content.size ? // is 0 when `[anime=477]Ария[/anime]` is pasted
      this.node.content :
      this.view.state.schema.text(this.node.attrs.text);
    const contentSize = this.node.content.size || content.nodeSize;

    this.dispatch(
      this.tr
        .setMeta('addToHistory', false)
        .replaceWith(
          selection.from,
          selection.to,
          content
        )
        .addMark(
          selection.from,
          selection.from + contentSize,
          this.markLinkInline(result)
        )
    );
  }

  replaceDefaultLink(result) {
    this.replaceWith(
      this.view.state.schema.text(
        result.text,
        [
          ...this.node.marks,
          this.markLinkInline(result)
        ]
      ),
      false
    );
  }

  replaceNode(result) {
    this.replaceWith(
      this.view.state.schema.nodes.link_block.create({
        ...result,
        type: this.type,
        meta: this.node.attrs.meta,
        nFormat: this.node.attrs.nFormat
      }, this.node.content, this.node.marks),
      false
    );
  }

  markLinkInline(result) {
    return this.view.state.schema.marks.link_inline.create({
      ...result,
      type: this.type,
      meta: this.node.attrs.meta
    }, null, this.node.marks);
  }

  notFound() {
    this.updateAttrs({ isLoading: false, isNotFound: true }, false);
  }

  error() {
    this.updateAttrs({ isLoading: false, isError: true }, false);
  }
}
