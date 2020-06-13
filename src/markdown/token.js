// based on https://github.com/markdown-it/markdown-it/blob/master/lib/token.js

export default class Token {
  constructor(type, content = null, children = null, attrs) {
    this.type = type;

    if (children) {
      this.children = children;
    }

    if (attrs) {
      this.attrs = attrs.constructor === Object ?
        Object.entries(attrs) :
        attrs;
    }

    if (content) {
      this.content = content;
    }
  }

  attrIndex(name) {
    let i;
    let len;

    if (!this.attrs) { return -1; }

    for (i = 0, len = this.attrs.length; i < len; i += 1) {
      if (this.attrs[i][0] === name) { return i; }
    }
    return -1;
  }

  attrPush(attrData) {
    if (this.attrs) {
      this.attrs.push(attrData);
    } else {
      this.attrs = [attrData];
    }
  }

  attrSet(name, value) {
    const idx = this.attrIndex(name);
    const attrData = [name, value];

    if (idx < 0) {
      this.attrPush(attrData);
    } else {
      this.attrs[idx] = attrData;
    }
  }

  attrGet(name) {
    const idx = this.attrIndex(name); let
      value = null;
    if (idx >= 0) {
      value = this.attrs[idx][1]; // eslint-disable-line
    }
    return value;
  }

  attrJoin(name, value) {
    const idx = this.attrIndex(name);

    if (idx < 0) {
      this.attrPush([name, value]);
    } else {
      this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
    }
  }
}
