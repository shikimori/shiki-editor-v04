import { expect } from 'chai';
import { MarkdownTokenizer } from '../../src/markdown';

function text(content) {
  return [{
    content: '',
    type: 'paragraph_open'
  }, {
    content,
    type: 'inline',
    children: [{
      content,
      type: 'text'
    }]
  }, {
    content: '',
    type: 'paragraph_close'
  }];
}

describe('MarkdownTokenizer', () => {
  it('<empty>', () => {
    expect(MarkdownTokenizer.parse('')).to.eql([]);
  });

  describe('parahraphs', () => {
    it('z', () => {
      expect(MarkdownTokenizer.parse('z')).to.eql([
        ...text('z')
      ]);
    });

    it('zzz', () => {
      expect(MarkdownTokenizer.parse('zzz')).to.eql([
        ...text('zzz')
      ]);
    });

    it('zzz\\nxxx', () => {
      expect(MarkdownTokenizer.parse('zzz\nxxx')).to.eql([
        ...text('zzz'),
        ...text('xxx')
      ]);
    });
  });

  describe('marks', () => {
    describe('strong', () => {
      it('[b]zxc[/b]', () => {
        expect(MarkdownTokenizer.parse('[b]zxc[/b]')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: '[b]zxc[/b]',
          type: 'inline',
          children: [{
            content: '',
            type: 'strong_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            content: '',
            type: 'strong_close'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });

      it('a[b]zxc[/b]A', () => {
        expect(MarkdownTokenizer.parse('a[b]zxc[/b]A')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: 'a[b]zxc[/b]A',
          type: 'inline',
          children: [{
            content: 'a',
            type: 'text'
          }, {
            content: '',
            type: 'strong_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            content: '',
            type: 'strong_close'
          }, {
            content: 'A',
            type: 'text'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });
    });

    describe('underline', () => {
      it('[u]zxc[/u]', () => {
        expect(MarkdownTokenizer.parse('[u]zxc[/u]')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: '[u]zxc[/u]',
          type: 'inline',
          children: [{
            content: '',
            type: 'underline_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            content: '',
            type: 'underline_close'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });
    });

    describe('deleted', () => {
      it('[s]zxc[/s]', () => {
        expect(MarkdownTokenizer.parse('[s]zxc[/s]')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: '[s]zxc[/s]',
          type: 'inline',
          children: [{
            content: '',
            type: 'deleted_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            content: '',
            type: 'deleted_close'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });
    });

    describe('inline_code', () => {
      it('`zxc`', () => {
        expect(MarkdownTokenizer.parse('`zxc`')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: '`zxc`',
          type: 'inline',
          children: [{
            content: 'zxc',
            type: 'code_inline'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });

      it('``zxc```', () => {
        expect(MarkdownTokenizer.parse('``zxc```')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: '``zxc```',
          type: 'inline',
          children: [{
            content: 'zxc',
            type: 'code_inline'
          }, {
            content: '`',
            type: 'text'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });

      it('a`zxc`A', () => {
        expect(MarkdownTokenizer.parse('a`zxc`A')).to.eql([{
          content: '',
          type: 'paragraph_open'
        }, {
          content: 'a`zxc`A',
          type: 'inline',
          children: [{
            content: 'a',
            type: 'text'
          }, {
            content: 'zxc',
            type: 'code_inline'
          }, {
            content: 'A',
            type: 'text'
          }]
        }, {
          content: '',
          type: 'paragraph_close'
        }]);
      });

      it('z`zxc', () => {
        expect(MarkdownTokenizer.parse('z`zxc')).to.eql([
          ...text('z`zxc')
        ]);
      });
    });
  });

  describe('nodes', () => {
    describe('blockquote', () => {
      it('> a', () => {
        expect(MarkdownTokenizer.parse('> a')).to.eql([{
          content: '',
          type: 'blockquote_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'blockquote_close'
        }]);
      });

      it('> a\\n> b\\n> c', () => {
        expect(MarkdownTokenizer.parse('> a\n> b\n> c')).to.eql([{
          content: '',
          type: 'blockquote_open'
        },
        ...text('a'),
        ...text('b'),
        ...text('c'),
        {
          content: '',
          type: 'blockquote_close'
        }]);
      });

      it('> > a', () => {
        expect(MarkdownTokenizer.parse('> > a')).to.eql([{
          content: '',
          type: 'blockquote_open'
        }, {
          content: '',
          type: 'blockquote_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'blockquote_close'
        }, {
          content: '',
          type: 'blockquote_close'
        }]);
      });

      it('> > a\\n> b', () => {
        expect(MarkdownTokenizer.parse('> > a\n> b')).to.eql([{
          content: '',
          type: 'blockquote_open'
        }, {
          content: '',
          type: 'blockquote_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'blockquote_close'
        },
        ...text('b'),
        {
          content: '',
          type: 'blockquote_close'
        }]);
      });
    });

    describe('bullet_list', () => {
      it('- a', () => {
        expect(MarkdownTokenizer.parse('- a')).to.eql([{
          content: '',
          type: 'bullet_list_open'
        }, {
          content: '',
          type: 'list_item_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'bullet_list_close'
        }]);
      });

      it('- a\\n- b', () => {
        expect(MarkdownTokenizer.parse('- a\n- b')).to.eql([{
          content: '',
          type: 'bullet_list_open'
        }, {
          content: '',
          type: 'list_item_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'list_item_open'
        },
        ...text('b'),
        {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'bullet_list_close'
        }]);
      });

      it('- test\\nn  zxc', () => {
        expect(MarkdownTokenizer.parse('- test\n  zxc')).to.eql([{
          content: '',
          type: 'bullet_list_open'
        }, {
          content: '',
          type: 'list_item_open'
        },
        ...text('test'),
        ...text('zxc'),
        {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'bullet_list_close'
        }]);
      });

      it('- > test', () => {
        expect(MarkdownTokenizer.parse('- > test')).to.eql([{
          content: '',
          type: 'bullet_list_open'
        }, {
          content: '',
          type: 'list_item_open'
        }, {
          content: '',
          type: 'blockquote_open'
        },
        ...text('test'),
        {
          content: '',
          type: 'blockquote_close'
        }, {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'bullet_list_close'
        }]);
      });

      it('[*] a', () => {
        expect(MarkdownTokenizer.parse('[*] a')).to.eql([{
          content: '',
          type: 'bullet_list_open'
        }, {
          content: '',
          type: 'list_item_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'bullet_list_close'
        }]);
      });

      it('[*]a', () => {
        expect(MarkdownTokenizer.parse('[*]a')).to.eql([{
          content: '',
          type: 'bullet_list_open'
        }, {
          content: '',
          type: 'list_item_open'
        },
        ...text('a'),
        {
          content: '',
          type: 'list_item_close'
        }, {
          content: '',
          type: 'bullet_list_close'
        }]);
      });
    });

    describe('code_block', () => {
      it('```\\nzxc\\nvbn\\n```', () => {
        expect(MarkdownTokenizer.parse('```\nzxc\nvbn\n```')).to.eql([{
          content: 'zxc\nvbn',
          type: 'code_block'
        }]);
      });

      it('qwe\\n```\\nzxc\\nvbn\\n```\\nrty', () => {
        expect(MarkdownTokenizer.parse('qwe\n```\nzxc\nvbn\n```\nrty')).to.eql([
          ...text('qwe'),
          {
            content: 'zxc\nvbn',
            type: 'code_block'
          },
          ...text('rty')
        ]);
      });

      it('```\\nzxc', () => {
        expect(MarkdownTokenizer.parse('```\nzxc')).to.eql([{
          content: 'zxc',
          type: 'code_block'
        }]);
      });
      it('```ruby\\nzxc\\n```', () => {
        expect(MarkdownTokenizer.parse('```ruby\nzxc\n```')).to.eql([{
          content: 'zxc',
          type: 'code_block',
          attrs: [['language', 'ruby']]
        }]);
      });
    });
  });
});
