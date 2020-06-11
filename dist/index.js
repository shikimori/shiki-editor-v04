'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var decko = require('decko');
var prosemirrorHistory = require('prosemirror-history');
var prosemirrorState = require('prosemirror-state');
var prosemirrorView = require('prosemirror-view');
var prosemirrorModel = require('prosemirror-model');
var prosemirrorKeymap = require('prosemirror-keymap');
var prosemirrorCommands = require('prosemirror-commands');
var prosemirrorInputrules = require('prosemirror-inputrules');
var prosemirrorUtils = require('prosemirror-utils');
var prosemirrorSchemaList = require('prosemirror-schema-list');
var vue = require('vue');
var prosemirrorMenu = require('prosemirror-menu');
var flatten = _interopDefault(require('lodash/flatten'));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }

  return desc;
}

// based on
// https://github.com/scrumpy/tiptap/blob/master/packages/tiptap/src/Utils/Extension.js
var Extension = /*#__PURE__*/function () {
  function Extension() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Extension);

    this.options = _objectSpread2(_objectSpread2({}, this.defaultOptions), options);
  }

  _createClass(Extension, [{
    key: "init",
    value: function init() {
      return null;
    }
  }, {
    key: "bindEditor",
    value: function bindEditor() {
      var editor = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      this.editor = editor;
    }
  }, {
    key: "inputRules",
    value: function inputRules() {
      return [];
    }
  }, {
    key: "pasteRules",
    value: function pasteRules() {
      return [];
    }
  }, {
    key: "keys",
    value: function keys() {
      return {};
    }
  }, {
    key: "name",
    get: function get() {
      return null;
    }
  }, {
    key: "type",
    get: function get() {
      return 'extension';
    }
  }, {
    key: "defaultOptions",
    get: function get() {
      return {};
    }
  }, {
    key: "plugins",
    get: function get() {
      return [];
    }
  }]);

  return Extension;
}();

function markIsActive (type, state) {
  var _state$selection = state.selection,
      from = _state$selection.from,
      $from = _state$selection.$from,
      to = _state$selection.to,
      empty = _state$selection.empty;

  if (empty) {
    return type.isInSet(state.storedMarks || $from.marks());
  }

  return state.doc.rangeHasMark(from, to, type);
}

function nodeIsActive (type, state) {
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var predicate = function predicate(node) {
    return node.type === type;
  };

  var node = prosemirrorUtils.findSelectedNodeOfType(type)(state.selection) || prosemirrorUtils.findParentNode(predicate)(state.selection);

  if (!Object.keys(attrs).length || !node) {
    return !!node;
  }

  return node.node.hasMarkup(type, _objectSpread2(_objectSpread2({}, node.node.attrs), attrs));
}

var Mark = /*#__PURE__*/function (_Extension) {
  _inherits(Mark, _Extension);

  var _super = _createSuper(Mark);

  function Mark() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Mark);

    return _super.call(this, options);
  }

  _createClass(Mark, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type;
      return function () {
        return prosemirrorCommands.toggleMark(type);
      };
    }
  }, {
    key: "activeCheck",
    value: function activeCheck(type, state) {
      return markIsActive(type, state);
    }
  }, {
    key: "markdownSerializerToken",
    value: function markdownSerializerToken() {
      return null;
    }
  }, {
    key: "type",
    get: function get() {
      return 'mark';
    }
  }, {
    key: "schema",
    get: function get() {
      return null;
    }
  }, {
    key: "markdownParserToken",
    get: function get() {
      return {
        mark: this.name
      };
    }
  }]);

  return Mark;
}(Extension);

var Node = /*#__PURE__*/function (_Extension) {
  _inherits(Node, _Extension);

  var _super = _createSuper(Node);

  function Node() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Node);

    return _super.call(this, options);
  }

  _createClass(Node, [{
    key: "commands",
    value: function commands(_ref) {
      var _type = _ref.type;
      return function () {
        return function (_state) {};
      };
    }
  }, {
    key: "activeCheck",
    value: function activeCheck(_ref2) {
      var _type = _ref2.type;
      return false;
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(_state, _node) {
      return null;
    }
  }, {
    key: "type",
    get: function get() {
      return 'node';
    }
  }, {
    key: "schema",
    get: function get() {
      return null;
    }
  }, {
    key: "view",
    get: function get() {
      return null;
    }
  }, {
    key: "markdownParserToken",
    get: function get() {
      return {
        block: this.name
      };
    }
  }]);

  return Node;
}(Extension);

var Doc = /*#__PURE__*/function (_Node) {
  _inherits(Doc, _Node);

  var _super = _createSuper(Doc);

  function Doc() {
    _classCallCheck(this, Doc);

    return _super.apply(this, arguments);
  }

  _createClass(Doc, [{
    key: "name",
    get: function get() {
      return 'doc';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'block+'
      };
    }
  }, {
    key: "markdownParserToken",
    get: function get() {
      return null;
    }
  }]);

  return Doc;
}(Node);

var Text = /*#__PURE__*/function (_Node) {
  _inherits(Text, _Node);

  var _super = _createSuper(Text);

  function Text() {
    _classCallCheck(this, Text);

    return _super.apply(this, arguments);
  }

  _createClass(Text, [{
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      state.text(node.text);
    }
  }, {
    key: "name",
    get: function get() {
      return 'text';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        group: 'inline'
      };
    }
  }, {
    key: "markdownParserToken",
    get: function get() {
      return null;
    }
  }]);

  return Text;
}(Node);

var Paragraph = /*#__PURE__*/function (_Node) {
  _inherits(Paragraph, _Node);

  var _super = _createSuper(Paragraph);

  function Paragraph() {
    _classCallCheck(this, Paragraph);

    return _super.apply(this, arguments);
  }

  _createClass(Paragraph, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type;
      return function () {
        return prosemirrorCommands.setBlockType(type);
      };
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      if (node.content.content.length) {
        state.renderInline(node);
        state.closeBlock(node);
      } else {
        if (!state.atBlank) {
          state.closeBlock(node);
        }

        state.write('\n');
      }
    }
  }, {
    key: "name",
    get: function get() {
      return 'paragraph';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'inline*',
        group: 'block',
        draggable: false,
        parseDOM: [{
          tag: 'p'
        }],
        toDOM: function toDOM() {
          return ['p', 0];
        }
      };
    }
  }]);

  return Paragraph;
}(Node);

function nodeInputRule (regexp, type, getAttrs) {
  return new prosemirrorInputrules.InputRule(regexp, function (state, match, start, end) {
    var attrs = getAttrs instanceof Function ? getAttrs(match) : getAttrs;
    var tr = state.tr;

    if (match[0]) {
      tr.replaceWith(start - 1, end, type.create(attrs));
    }

    return tr;
  });
}

// https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-commands/src/commands/toggleBlockType.js
function toggleBlockType (type, toggletype) {
  var attrs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return function (state, dispatch, view) {
    var isActive = nodeIsActive(type, state, attrs);

    if (isActive) {
      return prosemirrorCommands.setBlockType(toggletype)(state, dispatch, view);
    }

    return prosemirrorCommands.setBlockType(type, attrs)(state, dispatch, view);
  };
}

// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-commands/src/commands/toggleList.js

function isList(node, schema) {
  return node.type === schema.nodes.bullet_list || node.type === schema.nodes.ordered_list || node.type === schema.nodes.todo_list;
}

function toggleList(listType, itemType) {
  return function (state, dispatch, view) {
    var schema = state.schema,
        selection = state.selection;
    var $from = selection.$from,
        $to = selection.$to;
    var range = $from.blockRange($to);

    if (!range) {
      return false;
    }

    var parentList = prosemirrorUtils.findParentNode(function (node) {
      return isList(node, schema);
    })(selection);

    if (range.depth >= 1 && parentList && range.depth - parentList.depth <= 1) {
      if (parentList.node.type === listType) {
        return prosemirrorSchemaList.liftListItem(itemType)(state, dispatch, view);
      }

      if (isList(parentList.node, schema) && listType.validContent(parentList.node.content)) {
        var tr = state.tr;
        tr.setNodeMarkup(parentList.pos, listType);

        if (dispatch) {
          dispatch(tr);
        }

        return false;
      }
    }

    return prosemirrorSchemaList.wrapInList(listType)(state, dispatch, view);
  };
}

// based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-commands/src/commands/toggleWrap.js
function toggleWrap (type) {
  return function (state, dispatch, view) {
    var isActive = nodeIsActive(type, state);

    if (isActive) {
      return prosemirrorCommands.lift(state, dispatch);
    }

    return prosemirrorCommands.wrapIn(type)(state, dispatch, view);
  };
}

var Blockquote = /*#__PURE__*/function (_Node) {
  _inherits(Blockquote, _Node);

  var _super = _createSuper(Blockquote);

  function Blockquote() {
    _classCallCheck(this, Blockquote);

    return _super.apply(this, arguments);
  }

  _createClass(Blockquote, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleWrap(type, schema.nodes.paragraph);
      };
    }
  }, {
    key: "activeCheck",
    value: function activeCheck(type, state) {
      return nodeIsActive(type, state);
    }
  }, {
    key: "keys",
    value: function keys(_ref2) {
      var type = _ref2.type;
      return {
        'Ctrl->': toggleWrap(type)
      };
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref3) {
      var type = _ref3.type;
      return [prosemirrorInputrules.wrappingInputRule(/^\s*>\s$/, type)];
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      state.wrapBlock('> ', null, node, function () {
        return state.renderContent(node);
      });
    }
  }, {
    key: "name",
    get: function get() {
      return 'blockquote';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'block*',
        group: 'block',
        defining: true,
        draggable: false,
        parseDOM: [{
          tag: 'blockquote'
        }],
        toDOM: function toDOM() {
          return ['blockquote', {
            "class": 'b-quote-v2'
          }, 0];
        }
      };
    }
  }]);

  return Blockquote;
}(Node);

var BulletList = /*#__PURE__*/function (_Node) {
  _inherits(BulletList, _Node);

  var _super = _createSuper(BulletList);

  function BulletList() {
    _classCallCheck(this, BulletList);

    return _super.apply(this, arguments);
  }

  _createClass(BulletList, [{
    key: "commands",
    value: function commands(_ref) {
      var type = _ref.type,
          schema = _ref.schema;
      return function () {
        return toggleList(type, schema.nodes.list_item);
      };
    }
  }, {
    key: "activeCheck",
    value: function activeCheck(type, state) {
      return nodeIsActive(type, state);
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref2) {
      var type = _ref2.type;
      return [prosemirrorInputrules.wrappingInputRule(/^\s*([-+*])\s$/, type)];
    }
  }, {
    key: "keys",
    value: function keys(_ref3) {
      var type = _ref3.type,
          schema = _ref3.schema;
      return {
        'Shift-Ctrl-8': toggleList(type, schema.nodes.list_item)
      };
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      state.renderList(node, '  ', function () {
        return (node.attrs.bullet || '-') + ' ';
      });
    }
  }, {
    key: "name",
    get: function get() {
      return 'bullet_list';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'list_item+',
        group: 'block',
        attrs: {
          tight: {
            "default": false
          }
        },
        parseDOM: [{
          tag: 'ul',
          getAttrs: function getAttrs(dom) {
            return {
              tight: dom.hasAttribute('data-tight')
            };
          }
        }],
        toDOM: function toDOM(node) {
          return ['ul', {
            'data-tight': node.attrs.tight ? 'true' : null,
            "class": 'b-list'
          }, 0];
        }
      };
    }
  }]);

  return BulletList;
}(Node);

var CodeBlock = /*#__PURE__*/function (_Node) {
  _inherits(CodeBlock, _Node);

  var _super = _createSuper(CodeBlock);

  function CodeBlock() {
    _classCallCheck(this, CodeBlock);

    return _super.apply(this, arguments);
  }

  _createClass(CodeBlock, [{
    key: "commands",
    value: function commands(_ref) {
      var schema = _ref.schema,
          type = _ref.type;
      return function () {
        return toggleBlockType(type, schema.nodes.paragraph, {});
      };
    }
  }, {
    key: "activeCheck",
    value: function activeCheck(type, state) {
      return nodeIsActive(type, state);
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref2) {
      var type = _ref2.type;
      return [prosemirrorInputrules.textblockTypeInputRule(/^```\w* $/, type, function (match) {
        return {
          language: match[0].match(/`+(\w*)/)[1] || ''
        };
      })];
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      state.write('```' + (node.attrs.language || '') + '\n');
      state.text(node.textContent, false);
      state.ensureNewLine();
      state.write('```');
      state.closeBlock(node);
    }
  }, {
    key: "name",
    get: function get() {
      return 'code_block';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'text*',
        group: 'block',
        code: true,
        defining: true,
        marks: '',
        draggable: false,
        attrs: {
          language: {
            "default": ''
          }
        },
        parseDOM: [{
          tag: 'pre',
          preserveWhitespace: 'full',
          getAttrs: function getAttrs(node) {
            return {
              language: node.getAttribute('data-langauge') || ''
            };
          }
        }],
        toDOM: function toDOM(node) {
          return ['pre', {
            "class": 'b-code-v2',
            'data-language': node.attrs.language || ''
          }, ['code', 0]];
        }
      };
    }
  }, {
    key: "markdownParserToken",
    get: function get() {
      return {
        block: 'code_block',
        getAttrs: function getAttrs(token) {
          return {
            language: token.attrGet('language')
          };
        }
      };
    }
  }]);

  return CodeBlock;
}(Node);

//
var script = {
  props: {
    node: {
      type: Object,
      required: true
    },
    getPos: {
      type: Function,
      required: true
    },
    view: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    remove: function remove(e) {
      e.stopImmediatePropagation();
      this.view.dispatch(this.view.state.tr["delete"](this.getPos(), this.getPos() + 1));
    },
    select: function select() {
      this.view.dispatch(this.view.state.tr.setSelection(new prosemirrorState.NodeSelection(this.view.state.tr.doc.resolve(this.getPos()))));
    }
  }
};

var _withId = /*#__PURE__*/vue.withScopeId("data-v-1dc8d709");

vue.pushScopeId("data-v-1dc8d709");
var _hoisted_1 = { class: "controls" };
vue.popScopeId();

var render = /*#__PURE__*/_withId(function render(_ctx, _cache) {
  return (vue.openBlock(), vue.createBlock("span", {
    class: ["b-image unprocessed no-zoom", { "is-prosemirror-selected": _ctx.selected }],
    "data-src": _ctx.node.attrs.src,
    onClick: _cache[2] || (_cache[2] = function ($event) { return (_ctx.select($event)); })
  }, [
    vue.createVNode("div", _hoisted_1, [
      vue.createVNode("div", {
        class: "delete",
        onClick: _cache[1] || (_cache[1] = function ($event) { return (_ctx.remove($event)); })
      })
    ]),
    vue.createVNode("img", {
      src: _ctx.node.attrs.src
    }, null, 8 /* PROPS */, ["src"])
  ], 10 /* CLASS, PROPS */, ["data-src"]))
});

script.render = render;
script.__scopeId = "data-v-1dc8d709";
script.__file = "src/vue/image.vue";

var IMAGE_INPUT_REGEX = /\[img\](.*?)\[\/img\]/;

var Image = /*#__PURE__*/function (_Node) {
  _inherits(Image, _Node);

  var _super = _createSuper(Image);

  function Image() {
    _classCallCheck(this, Image);

    return _super.apply(this, arguments);
  }

  _createClass(Image, [{
    key: "inputRules",
    value: function inputRules(_ref) {
      var type = _ref.type;
      return [nodeInputRule(IMAGE_INPUT_REGEX, type, function (match) {
        var _match = _slicedToArray(match, 2),
            src = _match[1];

        return {
          src: src
        };
      })];
    }
  }, {
    key: "commands",
    value: function commands(_ref2) {
      var type = _ref2.type;
      return function () {
        return function (state, dispatch) {
          var src = prompt(I18n.t('frontend.shiki_editor.prompt.image_url'));

          if (src !== null) {
            var selection = state.selection;
            var position = selection.$cursor ? selection.$cursor.pos : selection.$to.pos;
            var node = type.create({
              src: src
            });
            var transaction = state.tr.insert(position, node);
            dispatch(transaction);
          }
        };
      };
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      state.write("[img]".concat(state.esc(node.attrs.src), "[/img]"));
    }
  }, {
    key: "name",
    get: function get() {
      return 'image';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        inline: true,
        attrs: {
          src: {}
        },
        group: 'inline',
        draggable: true,
        parseDOM: [{
          tag: 'span.b-image',
          getAttrs: function getAttrs(dom) {
            return {
              src: dom.getAttribute('data-src')
            };
          }
        }],
        toDOM: function toDOM(node) {
          return ['span', {
            "class": 'b-image unprocessed no-zoom',
            'data-src': node.attrs.src
          }, // { class: 'b-image unprocessed', href: node.attrs.src },
          ['img', node.attrs] ];
        }
      };
    }
  }, {
    key: "markdownParserToken",
    get: function get() {
      return {
        node: 'image',
        getAttrs: function getAttrs(token) {
          return {
            src: token.attrGet('src')
          };
        }
      };
    }
  }, {
    key: "view",
    get: function get() {
      return script;
    }
  }]);

  return Image;
}(Node);

var ListItem = /*#__PURE__*/function (_Node) {
  _inherits(ListItem, _Node);

  var _super = _createSuper(ListItem);

  function ListItem() {
    _classCallCheck(this, ListItem);

    return _super.apply(this, arguments);
  }

  _createClass(ListItem, [{
    key: "keys",
    value: function keys(_ref) {
      var type = _ref.type;
      return {
        'Shift-Enter': prosemirrorSchemaList.splitListItem(type),
        Tab: prosemirrorSchemaList.sinkListItem(type),
        'Shift-Tab': prosemirrorSchemaList.liftListItem(type)
      };
    }
  }, {
    key: "markdownSerialize",
    value: function markdownSerialize(state, node) {
      state.renderContent(node);
    }
  }, {
    key: "name",
    get: function get() {
      return 'list_item';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        content: 'block*',
        defining: true,
        parseDOM: [{
          tag: 'li'
        }],
        toDOM: function toDOM() {
          return ['li', 0];
        }
      };
    }
  }]);

  return ListItem;
}(Node);

var Strong = /*#__PURE__*/function (_Mark) {
  _inherits(Strong, _Mark);

  var _super = _createSuper(Strong);

  function Strong() {
    _classCallCheck(this, Strong);

    return _super.apply(this, arguments);
  }

  _createClass(Strong, [{
    key: "keys",
    value: function keys(_ref) {
      var _this = this;

      var type = _ref.type;
      return {
        'Mod-b': function ModB(state, dispatch) {
          return _this.commands({
            type: type
          })()(state, dispatch);
        }
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'strong';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'strong'
        }],
        toDOM: function toDOM() {
          return ['strong', 0];
        }
      };
    }
  }, {
    key: "markdownSerializerToken",
    get: function get() {
      return {
        open: '[b]',
        close: '[/b]',
        mixable: true,
        expelEnclosingWhitespace: true
      };
    }
  }]);

  return Strong;
}(Mark);

var Em = /*#__PURE__*/function (_Mark) {
  _inherits(Em, _Mark);

  var _super = _createSuper(Em);

  function Em() {
    _classCallCheck(this, Em);

    return _super.apply(this, arguments);
  }

  _createClass(Em, [{
    key: "keys",
    value: function keys(_ref) {
      var _this = this;

      var type = _ref.type;
      return {
        'Mod-i': function ModI(state, dispatch) {
          return _this.commands({
            type: type
          })()(state, dispatch);
        }
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'em';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'em'
        }],
        toDOM: function toDOM() {
          return ['em', 0];
        }
      };
    }
  }, {
    key: "markdownSerializerToken",
    get: function get() {
      return {
        open: '[i]',
        close: '[/i]',
        mixable: true,
        expelEnclosingWhitespace: true
      };
    }
  }]);

  return Em;
}(Mark);

var Underline = /*#__PURE__*/function (_Mark) {
  _inherits(Underline, _Mark);

  var _super = _createSuper(Underline);

  function Underline() {
    _classCallCheck(this, Underline);

    return _super.apply(this, arguments);
  }

  _createClass(Underline, [{
    key: "keys",
    value: function keys(_ref) {
      var _this = this;

      var type = _ref.type;
      return {
        'Mod-u': function ModU(state, dispatch) {
          return _this.commands({
            type: type
          })()(state, dispatch);
        }
      };
    }
  }, {
    key: "name",
    get: function get() {
      return 'underline';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'u'
        }],
        toDOM: function toDOM() {
          return ['u', 0];
        }
      };
    }
  }, {
    key: "markdownSerializerToken",
    get: function get() {
      return {
        open: '[u]',
        close: '[/u]',
        mixable: true,
        expelEnclosingWhitespace: true
      };
    }
  }]);

  return Underline;
}(Mark);

var Em$1 = /*#__PURE__*/function (_Mark) {
  _inherits(Em, _Mark);

  var _super = _createSuper(Em);

  function Em() {
    _classCallCheck(this, Em);

    return _super.apply(this, arguments);
  }

  _createClass(Em, [{
    key: "name",
    get: function get() {
      return 'deleted';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'del'
        }],
        toDOM: function toDOM() {
          return ['del', 0];
        }
      };
    }
  }, {
    key: "markdownSerializerToken",
    get: function get() {
      return {
        open: '[s]',
        close: '[/s]',
        mixable: true,
        expelEnclosingWhitespace: true
      };
    }
  }]);

  return Em;
}(Mark);

var CodeInline = /*#__PURE__*/function (_Mark) {
  _inherits(CodeInline, _Mark);

  var _super = _createSuper(CodeInline);

  function CodeInline() {
    _classCallCheck(this, CodeInline);

    return _super.apply(this, arguments);
  }

  _createClass(CodeInline, [{
    key: "name",
    get: function get() {
      return 'code_inline';
    }
  }, {
    key: "schema",
    get: function get() {
      return {
        parseDOM: [{
          tag: 'code'
        }],
        toDOM: function toDOM() {
          return ['code', {
            "class": 'b-code-v2-inline'
          }];
        }
      };
    }
  }, {
    key: "markdownSerializerToken",
    get: function get() {
      return {
        open: function open(_state, _mark, parent, index) {
          return backticksFor(parent.child(index), -1);
        },
        close: function close(_state, _mark, parent, index) {
          return backticksFor(parent.child(index - 1), 1);
        },
        escape: false
      };
    }
  }]);

  return CodeInline;
}(Mark);

function backticksFor(node, side) {
  var ticks = /`+/g;
  var m;
  var len = 0;
  if (node.isText) { while (m = ticks.exec(node.text)) {
    len = Math.max(len, m[0].length);
  } } // eslint-disable-line

  var result = len > 0 && side > 0 ? ' `' : '`';

  for (var i = 0; i < len; i++) {
    result += '`';
  }

  if (len > 0 && side < 0) { result += ' '; }
  return result;
}

var Emitter = /*#__PURE__*/function () {
  function Emitter() {
    _classCallCheck(this, Emitter);
  }

  _createClass(Emitter, [{
    key: "on",
    // Add an event listener for given event
    value: function on(event, fn) {
      this._callbacks = this._callbacks || {}; // Create namespace for this event

      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }

      this._callbacks[event].push(fn);

      return this;
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var arguments$1 = arguments;

      var _this = this;

      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments$1[_key];
      }

      this._callbacks = this._callbacks || {};
      var callbacks = this._callbacks[event];

      if (callbacks) {
        callbacks.forEach(function (callback) {
          return callback.apply(_this, args);
        });
      }

      return this;
    } // Remove event listener for given event.
    // If fn is not provided, all event listeners for that event will be removed.
    // If neither is provided, all event listeners will be removed.

  }, {
    key: "off",
    value: function off(event, fn) {
      if (!arguments.length) {
        this._callbacks = {};
      } else {
        // event listeners for the given event
        var callbacks = this._callbacks ? this._callbacks[event] : null;

        if (callbacks) {
          if (fn) {
            this._callbacks[event] = callbacks.filter(function (cb) {
              return cb !== fn;
            }); // remove specific handler
          } else {
            delete this._callbacks[event]; // remove all handlers
          }
        }
      }

      return this;
    }
  }]);

  return Emitter;
}();

var ExtensionManager = /*#__PURE__*/function () {
  function ExtensionManager() {
    var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var editor = arguments.length > 1 ? arguments[1] : undefined;

    _classCallCheck(this, ExtensionManager);

    extensions.forEach(function (extension) {
      extension.bindEditor(editor);
      extension.init();
    });
    this.extensions = extensions;
  }

  _createClass(ExtensionManager, [{
    key: "keymaps",
    value: function keymaps(_ref) {
      var schema = _ref.schema;
      var extensionKeymaps = this.extensions.filter(function (extension) {
        return ['extension'].includes(extension.type);
      }).filter(function (extension) {
        return extension.keys;
      }).map(function (extension) {
        return extension.keys({
          schema: schema
        });
      });
      var nodeMarkKeymaps = this.extensions.filter(function (extension) {
        return ['node', 'mark'].includes(extension.type);
      }).filter(function (extension) {
        return extension.keys;
      }).map(function (extension) {
        return extension.keys({
          type: schema["".concat(extension.type, "s")][extension.name],
          schema: schema
        });
      });
      return [].concat(_toConsumableArray(extensionKeymaps), _toConsumableArray(nodeMarkKeymaps)).map(function (keys) {
        return prosemirrorKeymap.keymap(keys);
      });
    }
  }, {
    key: "inputRules",
    value: function inputRules(_ref2) {
      var schema = _ref2.schema,
          excludedExtensions = _ref2.excludedExtensions;
      if (!(excludedExtensions instanceof Array) && excludedExtensions) { return []; }
      var allowedExtensions = excludedExtensions instanceof Array ? this.extensions.filter(function (extension) {
        return !excludedExtensions.includes(extension.name);
      }) : this.extensions;
      var extensionInputRules = allowedExtensions.filter(function (extension) {
        return ['extension'].includes(extension.type);
      }).filter(function (extension) {
        return extension.inputRules;
      }).map(function (extension) {
        return extension.inputRules({
          schema: schema
        });
      });
      var nodeMarkInputRules = allowedExtensions.filter(function (extension) {
        return ['node', 'mark'].includes(extension.type);
      }).filter(function (extension) {
        return extension.inputRules;
      }).map(function (extension) {
        return extension.inputRules({
          type: schema["".concat(extension.type, "s")][extension.name],
          schema: schema
        });
      });
      return [].concat(_toConsumableArray(extensionInputRules), _toConsumableArray(nodeMarkInputRules)).reduce(function (memo, inputRules) {
        return [].concat(_toConsumableArray(memo), _toConsumableArray(inputRules));
      }, []);
    }
  }, {
    key: "pasteRules",
    value: function pasteRules(_ref3) {
      var schema = _ref3.schema,
          excludedExtensions = _ref3.excludedExtensions;
      if (!(excludedExtensions instanceof Array) && excludedExtensions) { return []; }
      var allowedExtensions = excludedExtensions instanceof Array ? this.extensions.filter(function (extension) {
        return !excludedExtensions.includes(extension.name);
      }) : this.extensions;
      var extensionPasteRules = allowedExtensions.filter(function (extension) {
        return ['extension'].includes(extension.type);
      }).filter(function (extension) {
        return extension.pasteRules;
      }).map(function (extension) {
        return extension.pasteRules({
          schema: schema
        });
      });
      var nodeMarkPasteRules = allowedExtensions.filter(function (extension) {
        return ['node', 'mark'].includes(extension.type);
      }).filter(function (extension) {
        return extension.pasteRules;
      }).map(function (extension) {
        return extension.pasteRules({
          type: schema["".concat(extension.type, "s")][extension.name],
          schema: schema
        });
      });
      return [].concat(_toConsumableArray(extensionPasteRules), _toConsumableArray(nodeMarkPasteRules)).reduce(function (memo, pasteRules) {
        return [].concat(_toConsumableArray(memo), _toConsumableArray(pasteRules));
      }, []);
    }
  }, {
    key: "markdownParserTokens",
    value: function markdownParserTokens() {
      return this.extensions.filter(function (extension) {
        return extension.markdownParserToken;
      }).reduce(function (memo, extension) {
        memo[extension.name] = extension.markdownParserToken;
        return memo;
      }, {});
    }
  }, {
    key: "markdownSerializerTokens",
    value: function markdownSerializerTokens() {
      var nodes = this.extensions.filter(function (extension) {
        return extension.markdownSerialize;
      }).reduce(function (memo, extension) {
        var name = extension.name,
            markdownSerialize = extension.markdownSerialize;
        memo[name] = markdownSerialize;
        return memo;
      }, {});
      var marks = this.extensions.filter(function (extension) {
        return extension.markdownSerializerToken;
      }).reduce(function (memo, extension) {
        var name = extension.name,
            markdownSerializerToken = extension.markdownSerializerToken;
        memo[name] = markdownSerializerToken;
        return memo;
      }, {});
      return {
        nodes: nodes,
        marks: marks
      };
    }
  }, {
    key: "activeChecks",
    value: function activeChecks(_ref4) {
      var schema = _ref4.schema,
          view = _ref4.view;
      return this.extensions.filter(function (extension) {
        return extension.activeCheck;
      }).reduce(function (memo, extension) {
        var name = extension.name,
            type = extension.type;
        var schemaType = schema["".concat(type, "s")][name];

        memo[extension.name] = function (_state) {
          return extension.activeCheck(schemaType, view.state);
        };

        return memo;
      }, {});
    }
  }, {
    key: "commands",
    value: function commands(_ref5) {
      var schema = _ref5.schema,
          view = _ref5.view;
      return this.extensions.filter(function (extension) {
        return extension.commands;
      }).reduce(function (allCommands, extension) {
        var name = extension.name,
            type = extension.type;
        var commands = {};
        var value = extension.commands(_objectSpread2({
          schema: schema
        }, ['node', 'mark'].includes(type) ? {
          type: schema["".concat(type, "s")][name]
        } : {}));

        var apply = function apply(cb, attrs) {
          if (!view.editable) {
            return false;
          }

          view.focus();
          return cb(attrs)(view.state, view.dispatch, view);
        };

        var handle = function handle(_name, _value) {
          if (Array.isArray(_value)) {
            commands[_name] = function (attrs) {
              return _value.forEach(function (callback) {
                return apply(callback, attrs);
              });
            };
          } else if (typeof _value === 'function') {
            commands[_name] = function (attrs) {
              return apply(_value, attrs);
            };
          }
        };

        if (_typeof(value) === 'object') {
          Object.entries(value).forEach(function (_ref6) {
            var _ref7 = _slicedToArray(_ref6, 2),
                commandName = _ref7[0],
                commandValue = _ref7[1];

            handle(commandName, commandValue);
          });
        } else {
          handle(name, value);
        }

        return _objectSpread2(_objectSpread2({}, allCommands), commands);
      }, {});
    }
  }, {
    key: "nodes",
    get: function get() {
      return this.extensions.filter(function (extension) {
        return extension.type === 'node';
      }).reduce(function (nodes, _ref8) {
        var name = _ref8.name,
            schema = _ref8.schema;
        return _objectSpread2(_objectSpread2({}, nodes), {}, _defineProperty({}, name, schema));
      }, {});
    }
  }, {
    key: "options",
    get: function get() {
      var view = this.view;
      return this.extensions.reduce(function (nodes, extension) {
        return _objectSpread2(_objectSpread2({}, nodes), {}, _defineProperty({}, extension.name, new Proxy(extension.options, {
          set: function set(obj, prop, value) {
            var changed = obj[prop] !== value;
            Object.assign(obj, _defineProperty({}, prop, value));

            if (changed) {
              view.updateState(view.state);
            }

            return true;
          }
        })));
      }, {});
    }
  }, {
    key: "marks",
    get: function get() {
      return this.extensions.filter(function (extension) {
        return extension.type === 'mark';
      }).reduce(function (marks, _ref9) {
        var name = _ref9.name,
            schema = _ref9.schema;
        return _objectSpread2(_objectSpread2({}, marks), {}, _defineProperty({}, name, schema));
      }, {});
    }
  }, {
    key: "plugins",
    get: function get() {
      return this.extensions.filter(function (extension) {
        return extension.plugins;
      }).reduce(function (memo, _ref10) {
        var plugins = _ref10.plugins;
        return [].concat(_toConsumableArray(memo), _toConsumableArray(plugins));
      }, []);
    }
  }]);

  return ExtensionManager;
}();

//  based on https://github.com/scrumpy/tiptap/blob/master/packages/tiptap-utils/src/utils/getMarkRange.js
function getMarkRange() {
  var $pos = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (!$pos || !type) {
    return false;
  }

  var start = $pos.parent.childAfter($pos.parentOffset);

  if (!start.node) {
    return false;
  }

  var link = start.node.marks.find(function (mark) {
    return mark.type === type;
  });

  if (!link) {
    return false;
  }

  var startIndex = $pos.index();
  var startPos = $pos.start() + start.offset;
  var endIndex = startIndex + 1;
  var endPos = startPos + start.node.nodeSize;

  while (startIndex > 0 && link.isInSet($pos.parent.child(startIndex - 1).marks)) {
    startIndex -= 1;
    startPos -= $pos.parent.child(startIndex).nodeSize;
  }

  while (endIndex < $pos.parent.childCount && link.isInSet($pos.parent.child(endIndex).marks)) {
    endPos += $pos.parent.child(endIndex).nodeSize;
    endIndex += 1;
  }

  return {
    from: startPos,
    to: endPos
  };
}

var ComponentView = /*#__PURE__*/function () {
  function ComponentView(component, _ref, Vue) {
    var editor = _ref.editor,
        extension = _ref.extension,
        parent = _ref.parent,
        node = _ref.node,
        view = _ref.view,
        decorations = _ref.decorations,
        getPos = _ref.getPos;

    _classCallCheck(this, ComponentView);

    this.component = component;
    this.editor = editor;
    this.extension = extension;
    this.parent = parent;
    this.node = node;
    this.view = view;
    this.decorations = decorations;
    this.isNode = !!this.node.marks;
    this.isMark = !this.isNode;
    this.getPos = this.isMark ? this.getMarkPos : getPos;
    this.captureEvents = true;
    this.Vue = Vue;
    this.dom = this.createDOM();
    this.contentDOM = this.vm.$refs.content;
  }

  _createClass(ComponentView, [{
    key: "createDOM",
    value: function createDOM() {
      var _this = this;

      var Component = this.Vue.extend(this.component);
      var props = {
        editor: this.editor,
        node: this.node,
        view: this.view,
        getPos: function getPos() {
          return _this.getPos();
        },
        decorations: this.decorations,
        selected: false,
        options: this.extension.options,
        updateAttrs: function updateAttrs(attrs) {
          return _this.updateAttrs(attrs);
        }
      };

      if (typeof this.extension.setSelection === 'function') {
        this.setSelection = this.extension.setSelection;
      }

      if (typeof this.extension.update === 'function') {
        this.update = this.extension.update;
      }

      this.vm = new Component({
        parent: this.parent,
        propsData: props
      }).$mount();
      return this.vm.$el;
    }
  }, {
    key: "update",
    value: function update(node, decorations) {
      if (node.type !== this.node.type) {
        return false;
      }

      if (node === this.node && this.decorations === decorations) {
        return true;
      }

      this.node = node;
      this.decorations = decorations;
      this.updateComponentProps({
        node: node,
        decorations: decorations
      });
      return true;
    }
  }, {
    key: "updateComponentProps",
    value: function updateComponentProps(props) {
      var _this2 = this;

      if (!this.vm._props) {
        return;
      } // Update props in component
      // TODO: Avoid mutating a prop directly.
      // Maybe there is a better way to do this?


      var originalSilent = this.Vue.config.silent;
      this.Vue.config.silent = true;
      Object.entries(props).forEach(function (_ref2) {
        var _ref3 = _slicedToArray(_ref2, 2),
            key = _ref3[0],
            value = _ref3[1];

        _this2.vm._props[key] = value;
      }); // this.vm._props.node = node
      // this.vm._props.decorations = decorations

      this.Vue.config.silent = originalSilent;
    }
  }, {
    key: "updateAttrs",
    value: function updateAttrs(attrs) {
      if (!this.view.editable) {
        return;
      }

      var state = this.view.state;
      var type = this.node.type;
      var pos = this.getPos();

      var newAttrs = _objectSpread2(_objectSpread2({}, this.node.attrs), attrs);

      var transaction = this.isMark ? state.tr.removeMark(pos.from, pos.to, type).addMark(pos.from, pos.to, type.create(newAttrs)) : state.tr.setNodeMarkup(pos, null, newAttrs);
      this.view.dispatch(transaction);
    } // prevent a full re-render of the vue component on update
    // we'll handle prop updates in `update()`

  }, {
    key: "ignoreMutation",
    value: function ignoreMutation(mutation) {
      // allow leaf nodes to be selected
      if (mutation.type === 'selection') {
        return false;
      }

      if (!this.contentDOM) {
        return true;
      }

      return !this.contentDOM.contains(mutation.target);
    } // disable (almost) all prosemirror event listener for node views

  }, {
    key: "stopEvent",
    value: function stopEvent(event) {
      var _this3 = this;

      if (typeof this.extension.stopEvent === 'function') {
        return this.extension.stopEvent(event);
      }

      var draggable = !!this.extension.schema.draggable; // support a custom drag handle

      if (draggable && event.type === 'mousedown') {
        var dragHandle = event.target.closest && event.target.closest('[data-drag-handle]');
        var isValidDragHandle = dragHandle && (this.dom === dragHandle || this.dom.contains(dragHandle));

        if (isValidDragHandle) {
          this.captureEvents = false;
          document.addEventListener('dragend', function () {
            _this3.captureEvents = true;
          }, {
            once: true
          });
        }
      }

      var isCopy = event.type === 'copy';
      var isPaste = event.type === 'paste';
      var isCut = event.type === 'cut';
      var isDrag = event.type.startsWith('drag') || event.type === 'drop';

      if (draggable && isDrag || isCopy || isPaste || isCut) {
        return false;
      }

      return this.captureEvents;
    }
  }, {
    key: "selectNode",
    value: function selectNode() {
      this.updateComponentProps({
        selected: true
      });
    }
  }, {
    key: "deselectNode",
    value: function deselectNode() {
      this.updateComponentProps({
        selected: false
      });
    }
  }, {
    key: "getMarkPos",
    value: function getMarkPos() {
      var pos = this.view.posAtDOM(this.dom);
      var resolvedPos = this.view.state.doc.resolve(pos);
      var range = getMarkRange(resolvedPos, this.node.type);
      return range;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.vm.$destroy();
    }
  }]);

  return ComponentView;
}();

var icons = _objectSpread2(_objectSpread2({}, prosemirrorMenu.icons), {}, {
  code_inline: prosemirrorMenu.icons.code,
  bullet_list: prosemirrorMenu.icons.bulletList,
  bold: {
    width: 384,
    height: 512,
    path: 'M314.52 238.78A119.76 119.76 0 0 0 232 32H48a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h16v352H48a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h208a128 128 0 0 0 128-128c0-49.49-28.38-91.92-69.48-113.22zM128 80h88a72 72 0 0 1 0 144h-88zm112 352H128V272h112a80 80 0 0 1 0 160z'
  },
  deleted: {
    width: 512,
    height: 512,
    path: 'M150.39 208h113.17l-46.31-23.16a45.65 45.65 0 0 1 0-81.68A67.93 67.93 0 0 1 247.56 96H310a45.59 45.59 0 0 1 36.49 18.25l15.09 20.13a16 16 0 0 0 22.4 3.21l25.62-19.19a16 16 0 0 0 3.21-22.4L397.7 75.84A109.44 109.44 0 0 0 310.1 32h-62.54a132.49 132.49 0 0 0-58.94 13.91c-40.35 20.17-64.19 62.31-60.18 108 1.76 20.09 10.02 38.37 21.95 54.09zM496 240H16a16 16 0 0 0-16 16v16a16 16 0 0 0 16 16h480a16 16 0 0 0 16-16v-16a16 16 0 0 0-16-16zm-92.5 80h-91.07l14.32 7.16a45.65 45.65 0 0 1 0 81.68 67.93 67.93 0 0 1-30.31 7.16H234a45.59 45.59 0 0 1-36.49-18.25l-15.09-20.13a16 16 0 0 0-22.4-3.21L134.4 393.6a16 16 0 0 0-3.21 22.4l15.11 20.17A109.44 109.44 0 0 0 233.9 480h62.54a132.42 132.42 0 0 0 58.93-13.91c40.36-20.17 64.2-62.31 60.19-108-1.19-13.69-5.89-26.27-12.06-38.09z'
  },
  underline: {
    width: 448,
    height: 512,
    path: 'M 39.30162,88.303422 H 70.084683 V 279.0001 c 0,80.88106 69.050237,146.68975 153.915297,146.68975 84.86506,0 153.91531,-65.80869 153.91531,-146.68975 V 88.303422 h 30.78306 A 15.391532,14.668975 0 0 0 424.0899,73.634447 V 58.965471 A 15.391532,14.668975 0 0 0 408.69835,44.296496 H 285.5661 a 15.391532,14.668975 0 0 0 -15.39153,14.668975 v 14.668976 a 15.391532,14.668975 0 0 0 15.39153,14.668975 h 30.78307 V 279.0001 a 92.349194,88.013856 0 0 1 -184.69838,0 V 88.303422 h 30.78306 A 15.391532,14.668975 0 0 0 177.82539,73.634447 V 58.965471 A 15.391532,14.668975 0 0 0 162.43385,44.296496 H 39.30162 A 15.391532,14.668975 0 0 0 23.910089,58.965471 V 73.634447 A 15.391532,14.668975 0 0 0 39.30162,88.303422 Z M 424.0899,469.69677 H 23.910089 A 15.391532,14.668975 0 0 0 8.5185578,484.36576 v 14.66897 A 15.391532,14.668975 0 0 0 23.910089,513.70371 H 424.0899 a 15.391532,14.668975 0 0 0 15.39152,-14.66898 V 484.36576 A 15.391532,14.668975 0 0 0 424.0899,469.69677 Z'
  },
  image: {
    width: 1000,
    height: 1000,
    path: 'M 857.137 669.491 L 757.137 669.491 L 633.137 819.491 L 419.137 669.491 L 239.137 669.491 C 204.471 669.491 174.471 656.491 149.137 630.491 C 123.804 604.491 111.137 574.158 111.137 539.491 L 111.137 379.491 L 3.137 675.491 C -3.529 700.825 3.804 718.158 25.137 727.491 L 705.137 975.491 C 729.137 982.158 745.804 974.158 755.137 951.491 Z M 963.137 579.491 C 973.804 579.491 982.804 575.491 990.137 567.491 C 997.471 559.491 1001.137 550.158 1001.137 539.491 L 1001.137 67.491 C 1001.137 56.825 997.471 47.491 990.137 39.491 C 982.804 31.491 973.804 27.491 963.137 27.491 L 239.137 27.491 C 228.471 27.491 219.471 31.491 212.137 39.491 C 204.804 47.491 201.137 56.825 201.137 67.491 L 201.137 539.491 C 201.137 550.158 204.804 559.491 212.137 567.491 C 219.471 575.491 228.471 579.491 239.137 579.491 L 963.137 579.491 Z M 907.137 127.491 L 907.137 289.491 L 835.137 449.491 L 669.137 389.491 L 539.137 257.491 L 401.137 427.491 L 309.137 213.491 L 309.137 127.491 L 907.137 127.491 Z'
  },
  code_block: {
    width: 1810,
    height: 1625,
    path: 'M 536.134 757.124 C 569.134 757.124 600.134 780.124 608.134 813.124 L 778.134 1522.124 C 787.134 1575.124 753.134 1617.124 704.134 1617.124 C 671.134 1617.124 641.134 1594.124 633.134 1561.124 L 463.134 852.124 C 449.134 804.124 487.134 757.124 536.134 757.124 Z M 331.134 1045.124 L 327.134 1049.124 L 178.134 1187.124 L 326.134 1324.124 L 330.134 1328.124 C 359.134 1357.124 359.134 1405.124 330.134 1434.124 C 301.134 1463.124 253.134 1463.124 224.134 1434.124 L 27.134 1242.124 C 13.134 1228.124 3.134 1209.124 3.134 1187.124 C 3.134 1165.124 12.134 1147.124 27.134 1132.124 L 225.134 939.124 C 254.134 910.124 302.134 910.124 331.134 939.124 C 360.134 968.124 360.134 1016.124 331.134 1045.124 Z M 929.134 1049.124 L 925.134 1045.124 C 896.134 1016.124 896.134 968.124 925.134 939.124 C 954.134 910.124 1002.134 910.124 1031.134 939.124 L 1229.134 1132.124 C 1244.134 1147.124 1253.134 1165.124 1253.134 1187.124 C 1253.134 1209.124 1243.134 1228.124 1229.134 1242.124 L 1032.134 1434.124 C 1003.134 1463.124 955.134 1463.124 926.134 1434.124 C 897.134 1405.124 897.134 1357.124 926.134 1328.124 L 930.134 1324.124 L 1078.134 1187.124 Z M 1627.134 1387.124 L 1478.134 1387.124 C 1437.134 1387.124 1403.134 1353.124 1403.134 1312.124 C 1403.134 1271.124 1437.134 1237.124 1478.134 1237.124 L 1627.134 1237.124 C 1642.134 1237.124 1653.134 1226.124 1653.134 1212.124 L 1653.134 262.124 C 1653.134 249.124 1641.134 237.124 1628.134 237.124 L 478.134 237.124 C 464.134 237.124 453.134 248.124 453.134 262.124 L 453.134 512.124 C 453.134 553.124 419.134 587.124 378.134 587.124 C 337.134 587.124 303.134 553.124 303.134 512.124 L 303.134 262.124 C 303.134 165.124 381.134 87.124 478.134 87.124 L 1628.134 87.124 C 1724.134 87.124 1803.134 166.124 1803.134 262.124 L 1803.134 1212.124 C 1803.134 1309.124 1725.134 1387.124 1627.134 1387.124 Z'
  }
});

// const canInsert = nodeType => state => {
//   const { $from } = state.selection;
//   for (let d = $from.depth; d >= 0; d--) {
//     const index = $from.index(d);
//     if ($from.node(d).canReplaceWith(index, index, nodeType)) {
//       return true;
//     }
//   }
//   return false;
// };
// const insertBlockAfter = (node, state, dispatch) => {
//   const { tr } = state;
//   const pos = tr.selection.$anchor.after();
//   tr.insert(pos, node);
//   const selection = TextSelection.near(tr.doc.resolve(pos));
//   tr.setSelection(selection);
//   if (dispatch) {
//     dispatch(tr);
//   }
// };
// const insertBlock = nodeType => (state, dispatch) => {
//   insertBlockAfter(nodeType.createAndFill(), state, dispatch);
// };

prosemirrorMenu.undoItem.spec.title = function () {
  return I18n.t('frontend.shiki_editor.undo');
};

prosemirrorMenu.redoItem.spec.title = function () {
  return I18n.t('frontend.shiki_editor.redo');
};

function buildMenu (_ref) {
  var schema = _ref.schema,
      commands = _ref.commands,
      activeChecks = _ref.activeChecks;
  var marks = [];
  var undos = [prosemirrorMenu.undoItem, prosemirrorMenu.redoItem];
  var blocks = [];
  var uploads = [];

  function buildMenuItem(type) {
    return new prosemirrorMenu.MenuItem({
      title: function title() {
        return I18n.t("frontend.shiki_editor.".concat(type));
      },
      icon: icons[type],
      enable: function enable() {
        return true;
      },
      active: activeChecks[type],
      run: commands[type]
    });
  }

  ['strong', 'em', 'underline', 'deleted', 'code_inline'].forEach(function (type) {
    if (!schema.marks[type]) {
      return;
    }

    marks.push(buildMenuItem(type));
  });
  ['image'].forEach(function (type) {
    if (!schema.nodes[type]) {
      return;
    }

    uploads.push(buildMenuItem(type));
  });
  ['bullet_list', 'blockquote', 'code_block'].forEach(function (type) {
    if (!schema.nodes[type]) {
      return;
    }

    blocks.push(buildMenuItem(type));
  }); // blocks.push(liftItem);

  return prosemirrorMenu.menuBar({
    floating: true,
    content: [marks, undos, uploads, blocks]
  });
}

function maybeMerge(a, b) {
  if (a.isText && b.isText && prosemirrorModel.Mark.sameSet(a.marks, b.marks)) { return a.withText(a.text + b.text); }
} // Object used to track the context of a running parse.


var MarkdownParseState = /*#__PURE__*/function () {
  function MarkdownParseState(schema, tokenHandlers) {
    _classCallCheck(this, MarkdownParseState);

    this.schema = schema;
    this.stack = [{
      type: schema.topNodeType,
      content: []
    }];
    this.marks = prosemirrorModel.Mark.none;
    this.tokenHandlers = tokenHandlers;
  }

  _createClass(MarkdownParseState, [{
    key: "top",
    value: function top() {
      return this.stack[this.stack.length - 1];
    }
  }, {
    key: "push",
    value: function push(elt) {
      if (this.stack.length) { this.top().content.push(elt); }
    } // : (string)
    // Adds the given text to the current position in the document,
    // using the current marks as styling.

  }, {
    key: "addText",
    value: function addText(text) {
      if (!text) { return; }
      var nodes = this.top().content;
      var last = nodes[nodes.length - 1];
      var node = this.schema.text(text, this.marks);
      var merged;
      if (last && (merged = maybeMerge(last, node))) { nodes[nodes.length - 1] = merged; }else { nodes.push(node); }
    } // : (Mark)
    // Adds the given mark to the set of active marks.

  }, {
    key: "openMark",
    value: function openMark(mark) {
      this.marks = mark.addToSet(this.marks);
    } // : (Mark)
    // Removes the given mark from the set of active marks.

  }, {
    key: "closeMark",
    value: function closeMark(mark) {
      this.marks = mark.removeFromSet(this.marks);
    }
  }, {
    key: "parseTokens",
    value: function parseTokens(tokens) {
      for (var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var handler = this.tokenHandlers[token.type];
        if (!handler) { throw new Error('Token type `' + token.type + '` not supported by Markdown parser'); }
        handler(this, token);
      }
    } // : (NodeType, ?Object, ?[Node]) → ?Node
    // Add a node at the current position.

  }, {
    key: "addNode",
    value: function addNode(type, attrs, content) {
      var node = type.createAndFill(attrs, content, this.marks);
      if (!node) { return null; }
      this.push(node);
      return node;
    } // : (NodeType, ?Object)
    // Wrap subsequent content in a node of the given type.

  }, {
    key: "openNode",
    value: function openNode(type, attrs) {
      this.stack.push({
        type: type,
        attrs: attrs,
        content: []
      });
    } // : () → ?Node
    // Close and return the node that is currently on top of the stack.

  }, {
    key: "closeNode",
    value: function closeNode() {
      if (this.marks.length) { this.marks = prosemirrorModel.Mark.none; }
      var info = this.stack.pop();
      return this.addNode(info.type, info.attrs, info.content);
    }
  }]);

  return MarkdownParseState;
}();

/* eslint-disable */
// based on https://github.com/ProseMirror/prosemirror-markdown/blob/master/src/from_markdown.js
function tokenHandlers(schema, tokens) {
  var handlers = Object.create(null);

  var _loop = function _loop(type) {
    var spec = tokens[type];

    if (spec.block) {
      var nodeType = schema.nodeType(spec.block);

      if (noOpenClose(type)) {
        handlers[type] = function (state, token) {
          state.openNode(nodeType, attrs(spec, token));
          state.addText(withoutTrailingNewline(token.content));
          state.closeNode();
        };
      } else {
        handlers[type + '_open'] = function (state, token) {
          return state.openNode(nodeType, attrs(spec, token));
        };

        handlers[type + '_close'] = function (state) {
          return state.closeNode();
        };
      }
    } else if (spec.node) {
      var _nodeType = schema.nodeType(spec.node);

      handlers[type] = function (state, token) {
        return state.addNode(_nodeType, attrs(spec, token));
      };
    } else if (spec.mark) {
      var markType = schema.marks[spec.mark];

      if (noOpenClose(type)) {
        handlers[type] = function (state, token) {
          state.openMark(markType.create(attrs(spec, token)));
          state.addText(withoutTrailingNewline(token.content));
          state.closeMark(markType);
        };
      } else {
        handlers[type + '_open'] = function (state, token) {
          return state.openMark(markType.create(attrs(spec, token)));
        };

        handlers[type + '_close'] = function (state) {
          return state.closeMark(markType);
        };
      }
    } else if (spec.ignore) {
      if (noOpenClose(type)) {
        handlers[type] = noOp;
      } else {
        handlers[type + '_open'] = noOp;
        handlers[type + '_close'] = noOp;
      }
    } else {
      throw new RangeError('Unrecognized parsing spec ' + JSON.stringify(spec));
    }
  };

  for (var type in tokens) {
    _loop(type);
  }

  handlers.text = function (state, token) {
    return state.addText(token.content);
  };

  handlers.inline = function (state, token) {
    return state.parseTokens(token.children);
  };

  handlers.softbreak = handlers.softbreak || function (state) {
    return state.addText('\n');
  };

  return handlers;
}

function attrs(spec, token) {
  if (spec.getAttrs) { return spec.getAttrs(token); } // For backwards compatibility when `attrs` is a Function

  if (spec.attrs instanceof Function) { return spec.attrs(token); }
  return spec.attrs;
} // Code content is represented as a single token with a `content`
// property in Markdown-it.


function noOpenClose(type) {
  return type == 'code_inline' || type == 'code_block' || type == 'fence';
}

function withoutTrailingNewline(str) {
  return str[str.length - 1] == '\n' ? str.slice(0, str.length - 1) : str;
}

function noOp() {}

// [markdown-it](https://github.com/markdown-it/markdown-it) to
// tokenize a file, and then runs the custom rules it is given over
// the tokens to create a ProseMirror document tree.

var MarkdownParser = /*#__PURE__*/function () {
  // :: (Schema, MarkdownIt, Object)
  // Create a parser with the given configuration. You can configure
  // the markdown-it parser to parse the dialect you want, and provide
  // a description of the ProseMirror entities those tokens map to in
  // the `tokens` object, which maps token names to descriptions of
  // what to do with them. Such a description is an object, and may
  // have the following properties:
  //
  // **`node`**`: ?string`
  //   : This token maps to a single node, whose type can be looked up
  //     in the schema under the given name. Exactly one of `node`,
  //     `block`, or `mark` must be set.
  //
  // **`block`**`: ?string`
  //   : This token comes in `_open` and `_close` variants (which are
  //     appended to the base token name provides a the object
  //     property), and wraps a block of content. The block should be
  //     wrapped in a node of the type named to by the property's
  //     value.
  //
  // **`mark`**`: ?string`
  //   : This token also comes in `_open` and `_close` variants, but
  //     should add a mark (named by the value) to its content, rather
  //     than wrapping it in a node.
  //
  // **`attrs`**`: ?Object`
  //   : Attributes for the node or mark. When `getAttrs` is provided,
  //     it takes precedence.
  //
  // **`getAttrs`**`: ?(MarkdownToken) → Object`
  //   : A function used to compute the attributes for the node or mark
  //     that takes a [markdown-it
  //     token](https://markdown-it.github.io/markdown-it/#Token) and
  //     returns an attribute object.
  //
  // **`ignore`**`: ?bool`
  //   : When true, ignore content for the matched token.
  function MarkdownParser(schema, tokenizer, tokens) {
    _classCallCheck(this, MarkdownParser);

    // :: Object The value of the `tokens` object used to construct
    // this parser. Can be useful to copy and modify to base other
    // parsers on.
    this.tokens = tokens;
    this.schema = schema;
    this.tokenizer = tokenizer;
    this.tokenHandlers = tokenHandlers(schema, tokens);
  } // :: (string) → Node
  // Parse a string as [CommonMark](http://commonmark.org/) markup,
  // and create a ProseMirror document as prescribed by this parser's
  // rules.


  _createClass(MarkdownParser, [{
    key: "parse",
    value: function parse(text) {
      var state = new MarkdownParseState(this.schema, this.tokenHandlers);
      var doc;
      state.parseTokens(this.tokenizer.parse(text));

      do {
        doc = state.closeNode();
      } while (state.stack.length);

      return doc;
    }
  }]);

  return MarkdownParser;
}(); // // :: MarkdownParser

/* eslint no-param-reassign: 0, no-restricted-syntax: 0 */
// ::- This is an object used to track state and expose
// methods related to markdown serialization. Instances are passed to
// node and mark serialization methods (see `toMarkdown`).
var MarkdownSerializerState = /*#__PURE__*/function () {
  function MarkdownSerializerState(nodes, marks, options) {
    _classCallCheck(this, MarkdownSerializerState);

    this.nodes = nodes;
    this.marks = marks;
    this.delim = '';
    this.out = '';
    this.closed = false;
    this.inTightList = false; // :: Object
    // The options passed to the serializer.
    //   tightLists:: ?bool
    //   Whether to render lists in a tight style. This can be overridden
    //   on a node level by specifying a tight attribute on the node.
    //   Defaults to false.

    this.options = options || {};
    if (typeof this.options.tightLists === 'undefined') { this.options.tightLists = false; }
  }

  _createClass(MarkdownSerializerState, [{
    key: "flushClose",
    value: function flushClose(size) {
      if (this.closed) {
        // if (!this.atBlank()) this.out += '\n';
        if (size == null) { size = 2; }

        if (size > 1) {
          this.out += '\n'; // let delimMin = this.delim;
          // const trim = /\s+$/.exec(delimMin);
          // if (trim) {
          //   delimMin = delimMin.slice(0, delimMin.length - trim[0].length);
          // }
          // for (let i = 1; i < size; i++) {
          //   this.out += delimMin + '\n';
          // }
        }

        this.closed = false;
      }
    } // :: (string, ?string, Node, ())
    // Render a block, prefixing each line with `delim`, and the first
    // line in `firstDelim`. `node` should be the node that is closed at
    // the end of the block, and `f` is a function that renders the
    // content of the block.

  }, {
    key: "wrapBlock",
    value: function wrapBlock(delim, firstDelim, node, f) {
      var oldDelim = this.delim;
      this.write(firstDelim || delim);
      this.delim += delim;
      f();
      this.delim = oldDelim;
      this.closeBlock(node);
    }
  }, {
    key: "atBlank",
    value: function atBlank() {
      return /(^|\n)$/.test(this.out);
    } // :: ()
    // Ensure the current content ends with a newline.

  }, {
    key: "ensureNewLine",
    value: function ensureNewLine() {
      if (!this.atBlank()) { this.out += '\n'; }
    } // :: (?string)
    // Prepare the state for writing output (closing closed paragraphs,
    // adding delimiters, and so on), and then optionally add content
    // (unescaped) to the output.

  }, {
    key: "write",
    value: function write(content) {
      this.flushClose();

      if (this.delim && this.atBlank()) {
        this.out += this.delim;
      }

      if (content) {
        this.out += content;
      }
    } // :: (Node)
    // Close the block for the given node.

  }, {
    key: "closeBlock",
    value: function closeBlock(node) {
      this.closed = node;
    } // :: (string, ?bool)
    // Add the given text to the document. When escape is not `false`,
    // it will be escaped.

  }, {
    key: "text",
    value: function text(_text, escape) {
      var lines = _text.split('\n');

      for (var i = 0; i < lines.length; i++) {
        var startOfLine = this.atBlank() || this.closed;
        this.write();
        this.out += escape !== false ? this.esc(lines[i], startOfLine) : lines[i];
        if (i !== lines.length - 1) { this.out += '\n'; }
      }
    } // :: (Node)
    // Render the given node as a block.

  }, {
    key: "render",
    value: function render(node, parent, index) {
      if (typeof parent === 'number') { throw new Error('!'); }
      this.nodes[node.type.name](this, node, parent, index);
    } // :: (Node)
    // Render the contents of `parent` as block nodes.

  }, {
    key: "renderContent",
    value: function renderContent(parent) {
      var _this = this;

      parent.forEach(function (node, _, i) {
        return _this.render(node, parent, i);
      });
    } // :: (Node)
    // Render the contents of `parent` as inline content.

  }, {
    key: "renderInline",
    value: function renderInline(parent) {
      var _this2 = this;

      var active = [];
      var trailing = '';

      var progress = function progress(node, _, index) {
        var marks = node ? node.marks : []; // Remove marks from `hard_break` that are the last node inside
        // that mark to prevent parser edge cases with new lines just
        // before closing marks.
        // (FIXME it'd be nice if we had a schema-agnostic way to
        // identify nodes that serialize as hard breaks)
        // if (node && node.type.name === 'hard_break') {
        //   marks = marks.filter(m => {
        //     if (index + 1 === parent.childCount) return false;
        //     const next = parent.child(index + 1);
        //     return m.isInSet(next.marks) && (!next.isText || /\S/.test(next.text));
        //   });
        // }

        var leading = trailing;
        trailing = ''; // If whitespace has to be expelled from the node, adjust
        // leading and trailing accordingly.

        if (node && node.isText && marks.some(function (mark) {
          var info = _this2.marks[mark.type.name];
          return info && info.expelEnclosingWhitespace;
        })) {
          var _$exec = /^(\s*)(.*?)(\s*)$/m.exec(node.text),
              _$exec2 = _slicedToArray(_$exec, 4),
              _2 = _$exec2[0],
              lead = _$exec2[1],
              _inner = _$exec2[2],
              trail = _$exec2[3];

          leading += lead;
          trailing = trail;

          if (lead || trail) {
            node = _inner ? node.withText(_inner) : null;
            if (!node) { marks = active; }
          }
        }

        var inner = marks.length && marks[marks.length - 1];
        var noEsc = inner && _this2.marks[inner.type.name].escape === false;
        var len = marks.length - (noEsc ? 1 : 0); // Try to reorder 'mixable' marks, such as em and strong, which
        // in Markdown may be opened and closed in different order, so
        // that order of the marks for the token matches the order in
        // active.

        outer: for (var i = 0; i < len; i++) {
          var mark = marks[i];
          if (!_this2.marks[mark.type.name].mixable) { break; }

          for (var j = 0; j < active.length; j++) {
            var other = active[j];
            if (!_this2.marks[other.type.name].mixable) { break; }

            if (mark.eq(other)) {
              if (i > j) {
                marks = marks.slice(0, j).concat(mark).concat(marks.slice(j, i)).concat(marks.slice(i + 1, len));
              } else if (j > i) {
                marks = marks.slice(0, i).concat(marks.slice(i + 1, j)).concat(mark).concat(marks.slice(j, len));
              }

              continue outer;
            }
          }
        } // Find the prefix of the mark set that didn't change


        var keep = 0;

        while (keep < Math.min(active.length, len) && marks[keep].eq(active[keep])) {
          keep++;
        } // Close the marks that need to be closed


        while (keep < active.length) {
          _this2.text(_this2.markString(active.pop(), false, parent, index), false);
        } // Output any previously expelled trailing whitespace outside the marks


        if (leading) { _this2.text(leading); } // Open the marks that need to be opened

        if (node) {
          while (active.length < len) {
            var add = marks[active.length];
            active.push(add);

            _this2.text(_this2.markString(add, true, parent, index), false);
          } // Render the node. Special case code marks, since their content
          // may not be escaped.


          if (noEsc && node.isText) {
            _this2.text(_this2.markString(inner, true, parent, index) + node.text + _this2.markString(inner, false, parent, index + 1), false);
          } else { _this2.render(node, parent, index); }
        }
      };

      parent.forEach(progress);
      progress(null, null, parent.childCount);
    } // :: (Node, string, (number) → string)
    // Render a node's content as a list. `delim` should be the extra
    // indentation added to all lines except the first in an item,
    // `firstDelim` is a function going from an item index to a
    // delimiter for the first line of the item.

  }, {
    key: "renderList",
    value: function renderList(node, delim, firstDelim) {
      var _this3 = this;

      if (this.closed && this.closed.type === node.type) { this.flushClose(3); }else if (this.inTightList) { this.flushClose(1); }
      var isTight = typeof node.attrs.tight !== 'undefined' ? node.attrs.tight : this.options.tightLists;
      var prevTight = this.inTightList;
      this.inTightList = isTight;
      node.forEach(function (child, _, i) {
        if (i && isTight) { _this3.flushClose(1); }

        _this3.wrapBlock(delim, firstDelim(i), node, function () {
          return _this3.render(child, node, i);
        });
      });
      this.inTightList = prevTight;
    } // :: (string, ?bool) → string
    // Escape the given string so that it can safely appear in Markdown
    // content. If `startOfLine` is true, also escape characters that
    // has special meaning only at the start of the line.
    // esc(str, startOfLine) {
    //   str = str.replace(/[`*\\~\[\]]/g, '\\$&');
    //   if (startOfLine) str = str.replace(/^[:#\-*+]/, '\\$&').replace(/^(\d+)\./, '$1\\.');
    //   return str;
    // }

  }, {
    key: "esc",
    value: function esc(str) {
      return str;
    } // quote(str) {
    //   let wrap;
    //   if (str.indexOf('"') === -1) {
    //     wrap = '""';
    //   } else {
    //     wrap = str.indexOf('\'') === -1 ? '\'\'' : '()';
    //   }
    //
    //   return wrap[0] + str + wrap[1];
    // }
    // :: (string, number) → string
    // Repeat the given string `n` times.
    // repeat(str, n) {
    //   let out = '';
    //   for (let i = 0; i < n; i++) out += str;
    //   return out;
    // }
    // : (Mark, bool, string?) → string
    // Get the markdown string for a given opening or closing mark.

  }, {
    key: "markString",
    value: function markString(mark, open, parent, index) {
      var info = this.marks[mark.type.name];
      var value = open ? info.open : info.close;
      return typeof value === 'string' ? value : value(this, mark, parent, index);
    } // :: (string) → { leading: ?string, trailing: ?string }
    // Get leading and trailing whitespace from a string. Values of
    // leading or trailing property of the return object will be undefined
    // if there is no match.
    // getEnclosingWhitespace(text) {
    //   return {
    //     leading: (text.match(/^(\s+)/) || [])[0],
    //     trailing: (text.match(/(\s+)$/) || [])[0]
    //   };
    // }

  }]);

  return MarkdownSerializerState;
}();

var MarkdownSerializer = /*#__PURE__*/function () {
  // :: (Object<(state: MarkdownSerializerState, node: Node, parent: Node, index: number)>, Object)
  // Construct a serializer with the given configuration. The `nodes`
  // object should map node names in a given schema to function that
  // take a serializer state and such a node, and serialize the node.
  //
  // The `marks` object should hold objects with `open` and `close`
  // properties, which hold the strings that should appear before and
  // after a piece of text marked that way, either directly or as a
  // function that takes a serializer state and a mark, and returns a
  // string. `open` and `close` can also be functions, which will be
  // called as
  //
  //     (state: MarkdownSerializerState, mark: Mark,
  //      parent: Fragment, index: number) → string
  //
  // Where `parent` and `index` allow you to inspect the mark's
  // context to see which nodes it applies to.
  //
  // Mark information objects can also have a `mixable` property
  // which, when `true`, indicates that the order in which the mark's
  // opening and closing syntax appears relative to other mixable
  // marks can be varied. (For example, you can say `**a *b***` and
  // `*a **b***`, but not `` `a *b*` ``.)
  //
  // To disable character escaping in a mark, you can give it an
  // `escape` property of `false`. Such a mark has to have the highest
  // precedence (must always be the innermost mark).
  //
  // The `expelEnclosingWhitespace` mark property causes the
  // serializer to move enclosing whitespace from inside the marks to
  // outside the marks. This is necessary for emphasis marks as
  // CommonMark does not permit enclosing whitespace inside emphasis
  // marks, see: http://spec.commonmark.org/0.26/#example-330
  function MarkdownSerializer(nodes, marks) {
    _classCallCheck(this, MarkdownSerializer);

    // :: Object<(MarkdownSerializerState, Node)> The node serializer
    // functions for this serializer.
    this.nodes = nodes; // :: Object The mark serializer info.

    this.marks = marks;
  } // :: (Node, ?Object) → string
  // Serialize the content of the given node to
  // [CommonMark](http://commonmark.org/).


  _createClass(MarkdownSerializer, [{
    key: "serialize",
    value: function serialize(content, options) {
      var state = new MarkdownSerializerState(this.nodes, this.marks, options);
      state.renderContent(content);
      return state.out;
    }
  }]);

  return MarkdownSerializer;
}();

// based on https://github.com/markdown-it/markdown-it/blob/master/lib/token.js
var Token = /*#__PURE__*/function () {
  function Token(type, content) {
    var children = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _classCallCheck(this, Token);

    this.type = type;

    if (children) {
      this.children = children;
    }

    this.content = content;
  }

  _createClass(Token, [{
    key: "attrIndex",
    value: function attrIndex(name) {
      var i;
      var len;

      if (!this.attrs) {
        return -1;
      }

      for (i = 0, len = this.attrs.length; i < len; i += 1) {
        if (this.attrs[i][0] === name) {
          return i;
        }
      }

      return -1;
    }
  }, {
    key: "attrPush",
    value: function attrPush(attrData) {
      if (this.attrs) {
        this.attrs.push(attrData);
      } else {
        this.attrs = [attrData];
      }
    }
  }, {
    key: "attrSet",
    value: function attrSet(name, value) {
      var idx = this.attrIndex(name);
      var attrData = [name, value];

      if (idx < 0) {
        this.attrPush(attrData);
      } else {
        this.attrs[idx] = attrData;
      }
    }
  }, {
    key: "attrGet",
    value: function attrGet(name) {
      var idx = this.attrIndex(name);
      var value = null;

      if (idx >= 0) {
        value = this.attrs[idx][1]; // eslint-disable-line
      }

      return value;
    }
  }, {
    key: "attrJoin",
    value: function attrJoin(name, value) {
      var idx = this.attrIndex(name);

      if (idx < 0) {
        this.attrPush([name, value]);
      } else {
        this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
      }
    }
  }]);

  return Token;
}();

var MarkdownTokenizer = /*#__PURE__*/function () {
  function MarkdownTokenizer(text) {
    _classCallCheck(this, MarkdownTokenizer);

    this.SPECIAL_TAGS = {
      paragraph: 'p',
      bullet_list: 'ul',
      list_item: 'li',
      underline: 'span'
    };
    this.MAX_BBCODE_SIZE = 10;
    this.text = text;
    this.tokens = [];
    this.inlineTokens = [];
  }

  _createClass(MarkdownTokenizer, [{
    key: "parse",
    value: function parse() {
      this.index = -1;
      this.next();

      while (this.index < this.text.length) {
        this.parseLine('');
      }

      return flatten(this.tokens);
    }
  }, {
    key: "next",
    value: function next() {
      var steps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.index += steps;
      this.char1 = this.text[this.index];
      this.seq2 = this.char1 + this.text[this.index + 1];
      this.seq3 = this.seq2 + this.text[this.index + 2];
      this.seq4 = this.seq3 + this.text[this.index + 3];
      this.bbcode = this.char1 === '[' ? this.extractBbCode() : null;
    }
  }, {
    key: "parseLine",
    value: function parseLine(nestedSequence) {
      var startIndex = this.index;

      outer: while (this.index <= this.text.length) {
        // eslint-disable-line no-restricted-syntax
        var char1 = this.char1,
            seq2 = this.seq2,
            seq3 = this.seq3;
        var isStart = startIndex === this.index;
        var isEnd = char1 === '\n' || char1 === undefined;

        if (isEnd) {
          this.processParagraph(startIndex);
          this.next();
          return;
        }

        if (isStart) {
          switch (seq2) {
            case '> ':
              this.processBlockQuote(nestedSequence, seq2);
              break outer;

            case '- ':
            case '+ ':
            case '* ':
              this.processBulletList(nestedSequence, seq2);
              break outer;
          }

          switch (seq3) {
            case '```':
              this.processCode(seq3);
              break outer;
          }

          switch (this.bbcode) {
            case '[*]':
              this.processBulletList(nestedSequence, this.text[this.index + this.bbcode.length] === ' ' ? this.bbcode + ' ' : this.bbcode);
              break outer;
          }
        }

        this.processInline();
      }
    }
  }, {
    key: "processInline",
    value: function processInline() {
      var _inlineTokens;

      var inlineTokens = this.inlineTokens;

      switch (this.bbcode) {
        case '[b]':
          inlineTokens.push(this.tagOpen('strong'));
          this.next(this.bbcode.length);
          return;

        case '[/b]':
          inlineTokens.push(this.tagClose('strong'));
          this.next(4);
          return;

        case '[i]':
          inlineTokens.push(this.tagOpen('em'));
          this.next(3);
          return;

        case '[/i]':
          inlineTokens.push(this.tagClose('em'));
          this.next(4);
          return;

        case '[u]':
          inlineTokens.push(this.tagOpen('underline'));
          this.next(3);
          return;

        case '[/u]':
          inlineTokens.push(this.tagClose('underline'));
          this.next(4);
          return;

        case '[s]':
          inlineTokens.push(this.tagOpen('deleted'));
          this.next(3);
          return;

        case '[/s]':
          inlineTokens.push(this.tagClose('deleted'));
          this.next(4);
          return;

        case '[img]':
          if (this.processInlineImage(this.bbcode)) {
            return;
          }

          break;
      }

      if (this.char1 === '`') {
        if (this.processInlineCode()) {
          return;
        }
      }

      if (((_inlineTokens = inlineTokens[inlineTokens.length - 1]) === null || _inlineTokens === void 0 ? void 0 : _inlineTokens.type) !== 'text') {
        inlineTokens.push(new Token('text', ''));
      }

      var token = inlineTokens[inlineTokens.length - 1];
      token.content += this.char1;
      this.next();
    }
  }, {
    key: "processInlineCode",
    value: function processInlineCode() {
      var index = this.index;
      var tag = '`';
      var isFirstSymbolPassed = false;
      var startIndex = index;

      while (index <= this.text.length) {
        index += 1;
        var isEnd = this.text[index] === '\n' || this.text[index] === undefined;

        if (!isFirstSymbolPassed) {
          if (this.text[index] === '`') {
            tag += '`';
          } else {
            startIndex = index;
            isFirstSymbolPassed = true;
          }

          continue;
        }

        if (this.text[index] === '`' && this.text.slice(index, index + tag.length) === tag) {
          var code = this.text.slice(startIndex, index);
          this.inlineTokens.push(new Token('code_inline', code));
          this.next(code.length + tag.length * 2);
          return true;
        }

        if (isEnd) {
          return false;
        }
      }

      return false;
    }
  }, {
    key: "processInlineImage",
    value: function processInlineImage(tagStart) {
      var index = this.index + this.bbcode.length;
      var tagEnd = '[/img]';
      var startIndex = index;

      while (index <= this.text.length) {
        var isEnd = this.text[index] === '\n' || this.text[index] === undefined;

        if (this.text[index] === '[' && this.text.slice(index, index + tagEnd.length) === tagEnd) {
          var src = this.text.slice(startIndex, index);
          var token = new Token('image');
          token.attrSet('src', src);
          this.inlineTokens.push(token);
          this.next(src.length + tagStart.length + tagEnd.length);
          return true;
        }

        if (isEnd) {
          return false;
        }

        index += 1;
      }

      return false;
    }
  }, {
    key: "processParagraph",
    value: function processParagraph(startIndex) {
      var text = this.text.slice(startIndex, this.index);
      this.push(this.tagOpen('paragraph'));
      this.push(new Token('inline', text, this.inlineTokens));
      this.push(this.tagClose('paragraph'));
      this.inlineTokens = [];
    }
  }, {
    key: "processBlockQuote",
    value: function processBlockQuote(nestedSequence, tagSequence) {
      var newSequence = nestedSequence + tagSequence;
      this.push(this.tagOpen('blockquote'));

      do {
        this.next(tagSequence.length);
        this.parseLine(newSequence);
      } while (this.isContinued(newSequence));

      this.push(this.tagClose('blockquote'));
    }
  }, {
    key: "processBulletList",
    value: function processBulletList(nestedSequence, tagSequence) {
      var newSequence = nestedSequence + tagSequence;
      this.push(this.tagOpen('bullet_list'));

      do {
        this.next(tagSequence.length);
        this.push(this.tagOpen('list_item'));
        this.processBulletListLines(nestedSequence, '  ');
        this.push(this.tagClose('list_item'));
      } while (this.isContinued(newSequence));

      this.push(this.tagClose('bullet_list'));
    }
  }, {
    key: "processBulletListLines",
    value: function processBulletListLines(nestedSequence, tagSequence) {
      var newSequence = nestedSequence + tagSequence;
      var line = 0;

      do {
        if (line > 0) {
          this.next(newSequence.length);
        }

        this.parseLine(newSequence);
        line += 1;
      } while (this.isContinued(newSequence));
    }
  }, {
    key: "processCode",
    value: function processCode(sequence) {
      this.next(sequence.length);
      var language = this.extractLanguage();
      var startIndex = this.index;
      var isEnded = false;

      while (this.index <= this.text.length) {
        if (this.seq4 === '\n```') {
          this.next(5);
          isEnded = true;
          break;
        }

        this.next();
      }

      var token = new Token('code_block', this.text.slice(startIndex, isEnded ? this.index - 5 : this.index));

      if (language) {
        token.attrSet('language', language);
      }

      this.push(token);
    }
  }, {
    key: "extractLanguage",
    value: function extractLanguage() {
      var startIndex = this.index;

      while (this.index <= this.text.length) {
        var isEnd = this.char1 === '\n' || this.char1 === undefined;
        this.next();

        if (isEnd) {
          return this.text.slice(startIndex, this.index - 1);
        }
      }

      return null;
    }
  }, {
    key: "tagOpen",
    value: function tagOpen(type) {
      return new Token("".concat(type, "_open"), '');
    }
  }, {
    key: "tagClose",
    value: function tagClose(type) {
      return new Token("".concat(type, "_close"), '');
    }
  }, {
    key: "push",
    value: function push(token) {
      this.tokens.push(token);
    }
  }, {
    key: "isContinued",
    value: function isContinued(sequence) {
      return this.text.slice(this.index, this.index + sequence.length) === sequence;
    }
  }, {
    key: "extractBbCode",
    value: function extractBbCode() {
      for (var i = this.index + 1; i < this.index + this.MAX_BBCODE_SIZE; i++) {
        if (this.text[i] === ']') {
          return this.text.slice(this.index, i + 1);
        }
      }

      return null;
    }
  }], [{
    key: "parse",
    value: function parse(text) {
      return new MarkdownTokenizer(text).parse();
    }
  }]);

  return MarkdownTokenizer;
}();

var _class, _temp;
var ShikiEditor = (_class = (_temp = /*#__PURE__*/function (_Emitter) {
  _inherits(ShikiEditor, _Emitter);

  var _super = _createSuper(ShikiEditor);

  function ShikiEditor(options, Vue) {
    var _this;

    _classCallCheck(this, ShikiEditor);

    _this = _super.call(this, options);
    _this.options = {
      extensions: [],
      content: ''
    };
    _this.options = _objectSpread2(_objectSpread2({}, _this.options), options);
    _this.Vue = Vue;
    _this.extensions = _this.createExtensions();
    _this.element = _this.options.element || document.createElement('div');
    _this.nodes = _this.createNodes();
    _this.marks = _this.createMarks();
    _this.schema = _this.createSchema();
    _this.markdownParser = _this.createMarkdownParser();
    _this.markdownSerializer = _this.createMarkdownSerializer();
    _this.keymaps = _this.createKeymaps();
    _this.inputRules = _this.createInputRules();
    _this.pasteRules = _this.createPasteRules();
    _this.view = _this.createView();
    _this.commands = _this.createCommands();
    _this.activeChecks = _this.createActiveChecks();
    _this.plugins = _this.createPlugins();

    _this.attachPlugins(); // give extension manager access to our view


    _this.extensions.view = _this.view;
    return _this;
  }

  _createClass(ShikiEditor, [{
    key: "createExtensions",
    value: function createExtensions() {
      return new ExtensionManager([].concat(_toConsumableArray(this.builtInExtensions), _toConsumableArray(this.options.extensions)), this);
    }
  }, {
    key: "createNodes",
    value: function createNodes() {
      return this.extensions.nodes;
    }
  }, {
    key: "createMarks",
    value: function createMarks() {
      return this.extensions.marks;
    }
  }, {
    key: "createSchema",
    value: function createSchema() {
      return new prosemirrorModel.Schema({
        topNode: 'doc',
        nodes: this.nodes,
        marks: this.marks
      });
    }
  }, {
    key: "createMarkdownParser",
    value: function createMarkdownParser() {
      return new MarkdownParser(this.schema, MarkdownTokenizer, this.extensions.markdownParserTokens());
    }
  }, {
    key: "createMarkdownSerializer",
    value: function createMarkdownSerializer() {
      var _this$extensions$mark = this.extensions.markdownSerializerTokens(),
          nodes = _this$extensions$mark.nodes,
          marks = _this$extensions$mark.marks;

      return new MarkdownSerializer(nodes, marks);
    }
  }, {
    key: "createPlugins",
    value: function createPlugins() {
      return [].concat(_toConsumableArray(this.extensions.plugins), [prosemirrorHistory.history(), buildMenu(this), prosemirrorInputrules.inputRules({
        rules: this.inputRules
      })], _toConsumableArray(this.pasteRules), _toConsumableArray(this.keymaps), [prosemirrorKeymap.keymap({
        'Mod-z': prosemirrorHistory.undo,
        'Shift-Mod-z': prosemirrorHistory.redo,
        Backspace: prosemirrorCommands.joinBackward
      }), prosemirrorKeymap.keymap(prosemirrorCommands.baseKeymap)]);
    }
  }, {
    key: "createKeymaps",
    value: function createKeymaps() {
      return this.extensions.keymaps({
        schema: this.schema
      });
    }
  }, {
    key: "createInputRules",
    value: function createInputRules() {
      return this.extensions.inputRules({
        schema: this.schema,
        excludedExtensions: this.options.disableInputRules
      });
    }
  }, {
    key: "createPasteRules",
    value: function createPasteRules() {
      return this.extensions.pasteRules({
        schema: this.schema,
        excludedExtensions: this.options.disablePasteRules
      });
    }
  }, {
    key: "createView",
    value: function createView() {
      return new prosemirrorView.EditorView(this.element, {
        state: this.createState(),
        dispatchTransaction: this.dispatchTransaction
      });
    }
  }, {
    key: "createState",
    value: function createState() {
      return prosemirrorState.EditorState.create({
        schema: this.schema,
        doc: this.markdownParser.parse(this.options.content),
        plugins: []
      });
    }
  }, {
    key: "attachPlugins",
    value: function attachPlugins() {
      this.view.updateState(this.state.reconfigure({
        plugins: this.plugins
      }));
    }
  }, {
    key: "createCommands",
    value: function createCommands() {
      return this.extensions.commands({
        schema: this.schema,
        view: this.view
      });
    }
  }, {
    key: "createActiveChecks",
    value: function createActiveChecks() {
      return this.extensions.activeChecks({
        schema: this.schema,
        view: this.view
      });
    }
  }, {
    key: "initNodeViews",
    value: function initNodeViews(_ref) {
      var _this2 = this;

      var parent = _ref.parent,
          extensions = _ref.extensions;
      return extensions.filter(function (extension) {
        return ['node', 'mark'].includes(extension.type);
      }).filter(function (extension) {
        return extension.view;
      }).reduce(function (nodeViews, extension) {
        var nodeView = function nodeView(node, view, getPos, decorations) {
          var component = extension.view;
          return new ComponentView(component, {
            editor: _this2,
            extension: extension,
            parent: parent,
            node: node,
            view: view,
            getPos: getPos,
            decorations: decorations
          }, _this2.Vue);
        };

        return _objectSpread2(_objectSpread2({}, nodeViews), {}, _defineProperty({}, extension.name, nodeView));
      }, {});
    }
  }, {
    key: "setContent",
    value: function setContent(content) {
      var emitUpdate = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var _this$state = this.state,
          doc = _this$state.doc,
          tr = _this$state.tr;
      var document = this.markdownParser.parse(content);
      var selection = prosemirrorState.TextSelection.create(doc, 0, doc.content.size);
      var transaction = tr.setSelection(selection).replaceSelectionWith(document, false).setMeta('preventUpdate', !emitUpdate);
      this.view.dispatch(transaction);
    }
  }, {
    key: "setParentComponent",
    value: function setParentComponent() {
      var component = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (!component) {
        return;
      }

      this.view.setProps({
        nodeViews: this.initNodeViews({
          parent: component,
          extensions: [].concat(_toConsumableArray(this.builtInExtensions), _toConsumableArray(this.options.extensions)),
          editable: this.options.editable
        })
      });
    }
  }, {
    key: "dispatchTransaction",
    value: function dispatchTransaction(transaction) {
      var _this$state$applyTran = this.state.applyTransaction(transaction),
          state = _this$state$applyTran.state;

      this.view.updateState(state);

      if (!transaction.docChanged || transaction.getMeta('preventUpdate')) {
        return;
      }

      this.emit('update', {
        transaction: transaction
      });
    }
  }, {
    key: "exportMarkdown",
    value: function exportMarkdown() {
      return this.markdownSerializer.serialize(this.state.doc);
    }
  }, {
    key: "destroy",
    value: function destroy() {
      if (!this.view) {
        return;
      }

      this.view.destroy();
    }
  }, {
    key: "state",
    get: function get() {
      var _this$view;

      return (_this$view = this.view) === null || _this$view === void 0 ? void 0 : _this$view.state;
    }
  }, {
    key: "builtInExtensions",
    get: function get() {
      return [new Doc(), new Text(), new Paragraph(), new Strong(), new Em(), new Underline(), new Em$1(), new CodeInline(), new Blockquote(), new BulletList(), new CodeBlock(), new Image(), new ListItem()];
    }
  }]);

  return ShikiEditor;
}(Emitter), _temp), (_applyDecoratedDescriptor(_class.prototype, "dispatchTransaction", [decko.bind], Object.getOwnPropertyDescriptor(_class.prototype, "dispatchTransaction"), _class.prototype)), _class);

var editor_content = {
  props: {
    editor: {
      type: Object,
      required: true
    }
  },
  watch: {
    editor: {
      immediate: true,
      handler: function handler(editor) {
        var _this = this;

        if (editor && editor.element) {
          this.$nextTick(function () {
            _this.$el.appendChild(editor.element.firstChild);

            editor.setParentComponent(_this);
          });
        }
      }
    }
  },
  render: function render(createElement) {
    return createElement('div');
  },
  beforeDestroy: function beforeDestroy() {
    this.editor.element = this.$el;
  }
};

exports.Editor = ShikiEditor;
exports.EditorContent = editor_content;
//# sourceMappingURL=index.js.map
