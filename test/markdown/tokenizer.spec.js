import { expect } from 'chai';
import { MarkdownTokenizer } from '../../src/markdown';

function text(content) {
  return [{
    type: 'paragraph_open'
  }, {
    content,
    type: 'inline',
    children: [{
      content,
      type: 'text'
    }]
  }, {
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
          type: 'paragraph_open'
        }, {
          content: '[b]zxc[/b]',
          type: 'inline',
          children: [{
            type: 'strong_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'strong_close'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('[b]z', () => {
        expect(MarkdownTokenizer.parse('[b]z')).to.eql([
          ...text('[b]z')
        ]);
      });

      it('z[/b]', () => {
        expect(MarkdownTokenizer.parse('z[/b]')).to.eql([
          ...text('z[/b]')
        ]);
      });

      // it('**zxc**', () => {
      //   expect(MarkdownTokenizer.parse('**zxc**')).to.eql([{
      //     type: 'paragraph_open'
      //   }, {
      //     content: '**zxc**',
      //     type: 'inline',
      //     children: [{
      //       type: 'strong_open'
      //     }, {
      //       content: 'zxc',
      //       type: 'text'
      //     }, {
      //       type: 'strong_close'
      //     }]
      //   }, {
      //     type: 'paragraph_close'
      //   }]);
      // });

      // it('**z', () => {
      //   expect(MarkdownTokenizer.parse('**z')).to.eql([
      //     ...text('**z')
      //   ]);
      // });

      // it('z**', () => {
      //   expect(MarkdownTokenizer.parse('z**')).to.eql([
      //     ...text('z**')
      //   ]);
      // });

      it('a[b]zxc[/b]A', () => {
        expect(MarkdownTokenizer.parse('a[b]zxc[/b]A')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: 'a[b]zxc[/b]A',
          type: 'inline',
          children: [{
            content: 'a',
            type: 'text'
          }, {
            type: 'strong_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'strong_close'
          }, {
            content: 'A',
            type: 'text'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });
    });

    describe('em', () => {
      it('[i]zxc[/i]', () => {
        expect(MarkdownTokenizer.parse('[i]zxc[/i]')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '[i]zxc[/i]',
          type: 'inline',
          children: [{
            type: 'em_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'em_close'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('z[/i]', () => {
        expect(MarkdownTokenizer.parse('z[/i]')).to.eql([
          ...text('z[/i]')
        ]);
      });

      // it('*zxc*', () => {
      //   expect(MarkdownTokenizer.parse('*zxc*')).to.eql([{
      //     type: 'paragraph_open'
      //   }, {
      //     content: '*zxc*',
      //     type: 'inline',
      //     children: [{
      //       type: 'em_open'
      //     }, {
      //       content: 'zxc',
      //       type: 'text'
      //     }, {
      //       type: 'em_close'
      //     }]
      //   }, {
      //     type: 'paragraph_close'
      //   }]);
      // });
    });

    describe('underline', () => {
      it('[u]zxc[/u]', () => {
        expect(MarkdownTokenizer.parse('[u]zxc[/u]')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '[u]zxc[/u]',
          type: 'inline',
          children: [{
            type: 'underline_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'underline_close'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('z[/u]', () => {
        expect(MarkdownTokenizer.parse('z[/u]')).to.eql([
          ...text('z[/u]')
        ]);
      });
    });

    describe('deleted', () => {
      it('[s]zxc[/s]', () => {
        expect(MarkdownTokenizer.parse('[s]zxc[/s]')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '[s]zxc[/s]',
          type: 'inline',
          children: [{
            type: 'deleted_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'deleted_close'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('z[/s]', () => {
        expect(MarkdownTokenizer.parse('z[/s]')).to.eql([
          ...text('z[/s]')
        ]);
      });
    });

    describe('inline_code', () => {
      it('`zxc`', () => {
        expect(MarkdownTokenizer.parse('`zxc`')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '`zxc`',
          type: 'inline',
          children: [{
            content: 'zxc',
            type: 'code_inline'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('``zxc```', () => {
        expect(MarkdownTokenizer.parse('``zxc```')).to.eql([{
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
          type: 'paragraph_close'
        }]);
      });

      it('a`zxc`A', () => {
        expect(MarkdownTokenizer.parse('a`zxc`A')).to.eql([{
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
          type: 'paragraph_close'
        }]);
      });

      it('z`zxc', () => {
        expect(MarkdownTokenizer.parse('z`zxc')).to.eql([
          ...text('z`zxc')
        ]);
      });
    });


    describe('spoiler_inline', () => {
      it('||zxc||', () => {
        expect(MarkdownTokenizer.parse('||zxc||')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '||zxc||',
          type: 'inline',
          children: [{
            type: 'spoiler_inline_open'
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'spoiler_inline_close'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('||z', () => {
        expect(MarkdownTokenizer.parse('||z')).to.eql([
          ...text('||z')
        ]);
      });

      it('z||', () => {
        expect(MarkdownTokenizer.parse('z||')).to.eql([
          ...text('z||')
        ]);
      });
    });

    describe('link', () => {
      it('[url=https://ya.ru]zxc[/url]', () => {
        expect(MarkdownTokenizer.parse('[url=https://ya.ru]zxc[/url]')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '[url=https://ya.ru]zxc[/url]',
          type: 'inline',
          children: [{
            type: 'link_open',
            attrs: [['href', 'https://ya.ru']]
          }, {
            content: 'zxc',
            type: 'text'
          }, {
            type: 'link_close'
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('z[/url]', () => {
        expect(MarkdownTokenizer.parse('z[/url]')).to.eql([
          ...text('z[/url]')
        ]);
      });
    });
  });

  describe('nodes', () => {
    describe('blockquote', () => {
      it('> a', () => {
        expect(MarkdownTokenizer.parse('> a')).to.eql([{
          type: 'blockquote_open'
        },
        ...text('a'),
        {
          type: 'blockquote_close'
        }]);
      });

      it('> a\\n> b\\n> c', () => {
        expect(MarkdownTokenizer.parse('> a\n> b\n> c')).to.eql([{
          type: 'blockquote_open'
        },
        ...text('a'),
        ...text('b'),
        ...text('c'),
        {
          type: 'blockquote_close'
        }]);
      });

      it('> > a', () => {
        expect(MarkdownTokenizer.parse('> > a')).to.eql([{
          type: 'blockquote_open'
        }, {
          type: 'blockquote_open'
        },
        ...text('a'),
        {
          type: 'blockquote_close'
        }, {
          type: 'blockquote_close'
        }]);
      });

      it('> > a\\n> b', () => {
        expect(MarkdownTokenizer.parse('> > a\n> b')).to.eql([{
          type: 'blockquote_open'
        }, {
          type: 'blockquote_open'
        },
        ...text('a'),
        {
          type: 'blockquote_close'
        },
        ...text('b'),
        {
          type: 'blockquote_close'
        }]);
      });
    });

    describe('bullet_list', () => {
      it('- a', () => {
        expect(MarkdownTokenizer.parse('- a')).to.eql([{
          type: 'bullet_list_open'
        }, {
          type: 'list_item_open'
        },
        ...text('a'),
        {
          type: 'list_item_close'
        }, {
          type: 'bullet_list_close'
        }]);
      });

      it('- a\\n- b', () => {
        expect(MarkdownTokenizer.parse('- a\n- b')).to.eql([{
          type: 'bullet_list_open'
        }, {
          type: 'list_item_open'
        },
        ...text('a'),
        {
          type: 'list_item_close'
        }, {
          type: 'list_item_open'
        },
        ...text('b'),
        {
          type: 'list_item_close'
        }, {
          type: 'bullet_list_close'
        }]);
      });

      it('- test\\nn  zxc', () => {
        expect(MarkdownTokenizer.parse('- test\n  zxc')).to.eql([{
          type: 'bullet_list_open'
        }, {
          type: 'list_item_open'
        },
        ...text('test'),
        ...text('zxc'),
        {
          type: 'list_item_close'
        }, {
          type: 'bullet_list_close'
        }]);
      });

      it('- > test', () => {
        expect(MarkdownTokenizer.parse('- > test')).to.eql([{
          type: 'bullet_list_open'
        }, {
          type: 'list_item_open'
        }, {
          type: 'blockquote_open'
        },
        ...text('test'),
        {
          type: 'blockquote_close'
        }, {
          type: 'list_item_close'
        }, {
          type: 'bullet_list_close'
        }]);
      });

      it('[*] a', () => {
        expect(MarkdownTokenizer.parse('[*] a')).to.eql([{
          type: 'bullet_list_open'
        }, {
          type: 'list_item_open'
        },
        ...text('a'),
        {
          type: 'list_item_close'
        }, {
          type: 'bullet_list_close'
        }]);
      });

      it('[*]a', () => {
        expect(MarkdownTokenizer.parse('[*]a')).to.eql([{
          type: 'bullet_list_open'
        }, {
          type: 'list_item_open'
        },
        ...text('a'),
        {
          type: 'list_item_close'
        }, {
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

    describe('image', () => {
      it('[img]https://test.com[/img]', () => {
        expect(MarkdownTokenizer.parse('[img]https://test.com[/img]')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '[img]https://test.com[/img]',
          type: 'inline',
          children: [{
            type: 'image',
            attrs: [['src', 'https://test.com'], ['isPoster', false]]
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });

      it('[poster]https://test.com[/poster]', () => {
        expect(MarkdownTokenizer.parse('[poster]https://test.com[/poster]')).to.eql([{
          type: 'paragraph_open'
        }, {
          content: '[poster]https://test.com[/poster]',
          type: 'inline',
          children: [{
            type: 'image',
            attrs: [['src', 'https://test.com'], ['isPoster', true]]
          }]
        }, {
          type: 'paragraph_close'
        }]);
      });
    });

    describe('spoiler', () => {
      it('[spoiler]z[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler]z[/spoiler]')).to.eql([{
          type: 'spoiler_open'
        },
        ...text('z'),
        {
          type: 'spoiler_close'
        }]);
      });

      it('[spoiler=qw er]z[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler=qw er]z[/spoiler]')).to.eql([{
          type: 'spoiler_open',
          attrs: [['label', 'qw er']]
        },
        ...text('z'),
        {
          type: 'spoiler_close'
        }]);
      });

      it('[spoiler]\\nz\\n[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler]\nz\n[/spoiler]')).to.eql([{
          type: 'spoiler_open'
        },
        ...text('z'),
        {
          type: 'spoiler_close'
        }]);
      });

      it('[spoiler]\\nz[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler]\nz[/spoiler]')).to.eql([{
          type: 'spoiler_open'
        },
        ...text('z'),
        {
          type: 'spoiler_close'
        }]);
      });

      it('[spoiler]\\nz[/spoiler]qwe', () => {
        expect(MarkdownTokenizer.parse('[spoiler]\nz[/spoiler]qwe')).to.eql([{
          type: 'spoiler_open'
        },
        ...text('z'),
        {
          type: 'spoiler_close'
        },
        ...text('qwe')
        ]);
      });
    });

    describe('quote', () => {
      it('[quote]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote]z[/quote]')).to.eql([{
          type: 'quote_open'
        },
        ...text('z'),
        {
          type: 'quote_close'
        }]);
      });

      it('[quote]\\nz\\n[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote]\nz\n[/quote]')).to.eql([{
          type: 'quote_open'
        },
        ...text('z'),
        {
          type: 'quote_close'
        }]);
      });

      it('q[quote]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('q[quote]z[/quote]')).to.eql([
          ...text('q'),
          {
            type: 'quote_open'
          },
          ...text('z'),
          {
            type: 'quote_close'
          }
        ]);
      });

      it('[quote]z[/quote]q', () => {
        expect(MarkdownTokenizer.parse('[quote]z[/quote]q')).to.eql([{
          type: 'quote_open'
        },
        ...text('z'),
        {
          type: 'quote_close'
        },
        ...text('q')
        ]);
      });

      it('[quote=x]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote=x]z[/quote]')).to.eql([{
          type: 'quote_open',
          attrs: [['nickname', 'x']]
        },
        ...text('z'),
        {
          type: 'quote_close'
        }]);
      });

      it('[quote=t1;2;x]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote=t1;2;x]z[/quote]')).to.eql([{
          type: 'quote_open',
          attrs: [['topic_id', '1'], ['user_id', '2'], ['nickname', 'x']]
        },
        ...text('z'),
        {
          type: 'quote_close'
        }]);
      });

      it('[quote=m1;2;x]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote=m1;2;x]z[/quote]')).to.eql([{
          type: 'quote_open',
          attrs: [['message_id', '1'], ['user_id', '2'], ['nickname', 'x']]
        },
        ...text('z'),
        {
          type: 'quote_close'
        }]);
      });
    });
  });
});
