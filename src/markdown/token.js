// based on https://github.com/markdown-it/markdown-it/blob/master/lib/token.js

export class Token {
  constructor(type, content, children = null) {
    /**
    * Token#type -> String
    *
    * Type of the token (string, e.g. "paragraph_open")
    * */
    this.type = type;

    /**
    * Token#tag -> String
    *
    * html tag name, e.g. "p"
    * */
    // this.tag = tag;

    /**
    * Token#attrs -> Array
    *
    * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
    * */
    // this.attrs    = null;

    /**
    * Token#map -> Array
    *
    * Source map info. Format: `[ line_begin, line_end ]`
    * */
    // this.map      = null;

    /**
    * Token#nesting -> Number
    *
    * Level change (number in {-1, 0, 1} set), where:
    *
    * -  `1` means the tag is opening
    * -  `0` means the tag is self-closing
    * - `-1` means the tag is closing
    * */
    // this.nesting = nesting;

    /**
    * Token#level -> Number
    *
    * nesting level, the same as `state.level`
    * */
    // this.level    = 0;

    /**
    * Token#children -> Array
    *
    * An array of child nodes (inline and img tokens)
    * */
    if (children) {
      this.children = children;
    }

    /**
    * Token#content -> String
    *
    * In a case of self-closing tag (code, html, fence, etc.),
    * it has contents of this tag.
    * */
    this.content = content;

    /**
    * Token#markup -> String
    *
    * '*' or '_' for emphasis, fence string for fence, etc.
    * */
    // this.markup   = '';

    /**
    * Token#info -> String
    *
    * fence infostring
    * */
    // this.info     = '';

    /**
    * Token#meta -> Object
    *
    * A place for plugins to store an arbitrary data
    * */
    // this.meta     = null;

    /**
    * Token#block -> Boolean
    *
    * True for block-level tokens, false for inline tokens.
    * Used in renderer to calculate line breaks
    * */
    // this.block    = false;

    /**
    * Token#hidden -> Boolean
    *
    * If it's true, ignore this element when rendering. Used for tight lists
    * to hide paragraphs.
    * */
    // this.hidden   = false;
  }

  /**
  * Search attribute index by name.
  * */
  attrIndex(name) {
    let i;
    let len;

    if (!this.attrs) { return -1; }

    for (i = 0, len = this.attrs.length; i < len; i += 1) {
      if (this.attrs[i][0] === name) { return i; }
    }
    return -1;
  }

  /**
  * Add `[ name, value ]` attribute to list. Init attrs if necessary
  * */
  attrPush(attrData) {
    if (this.attrs) {
      this.attrs.push(attrData);
    } else {
      this.attrs = [attrData];
    }
  }

  /**
  * Set `name` attribute to `value`. Override old value if exists.
  * */
  attrSet(name, value) {
    const idx = this.attrIndex(name);
    const attrData = [name, value];

    if (idx < 0) {
      this.attrPush(attrData);
    } else {
      this.attrs[idx] = attrData;
    }
  }

  /**
  * Get the value of attribute `name`, or null if it does not exist.
  * */
  attrGet(name) {
    const idx = this.attrIndex(name); let
      value = null;
    if (idx >= 0) {
      value = this.attrs[idx][1]; // eslint-disable-line
    }
    return value;
  }

  /**
  * Join value to existing attribute via space. Or create new attribute if not
  * exists. Useful to operate with token classes.
  * */
  attrJoin(name, value) {
    const idx = this.attrIndex(name);

    if (idx < 0) {
      this.attrPush([name, value]);
    } else {
      this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
    }
  }
}
