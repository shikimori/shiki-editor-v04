import { expect } from 'chai';
import { MarkdownTokenizer } from '../../src/markdown';

function text(content) {
  return [
    { type: 'paragraph', direction: 'open' },
    { type: 'inline', children: [ { type: 'text', content } ] },
    { type: 'paragraph', direction: 'close' }
  ];
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

    it('\\n', () => {
      expect(MarkdownTokenizer.parse('\n')).to.eql([
        { type: 'paragraph', direction: 'open' },
        { type: 'inline', children: [] },
        { type: 'paragraph', direction: 'close' }
      ]);
    });

    it('[br]', () => {
      expect(MarkdownTokenizer.parse('qwe[br]zxc')).to.eql([
        ...text('qwe'),
        ...text('zxc')
      ]);
    });
  });

  describe('marks', () => {
    describe('bold', () => {
      it('[b]zxc[/b]', () => {
        expect(MarkdownTokenizer.parse('[b]zxc[/b]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'bold', direction: 'open', bbcode: '[b]' },
              { type: 'text', content: 'zxc' },
              { type: 'bold', direction: 'close', bbcode: '[/b]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
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
      //     type: 'paragraph', direction: 'open'
      //   }, {
      //     type: 'inline',
      //     children: [{
      //       type: 'bold', direction: 'open'
      //     }, {
      //       content: 'zxc',
      //       type: 'text'
      //     }, {
      //       type: 'bold', direction: 'close', bbcode: '[/b]'
      //     }]
      //   }, {
      //     type: 'paragraph', direction: 'close'
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
        expect(MarkdownTokenizer.parse('a[b]zxc[/b]A')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'text', content: 'a' },
              { type: 'bold', direction: 'open', bbcode: '[b]' },
              { type: 'text', content: 'zxc' },
              { type: 'bold', direction: 'close', bbcode: '[/b]' },
              { type: 'text', content: 'A' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });
    });

    describe('italic', () => {
      it('[i]zxc[/i]', () => {
        expect(MarkdownTokenizer.parse('[i]zxc[/i]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'italic', direction: 'open', bbcode: '[i]' },
              { type: 'text', content: 'zxc' },
              { type: 'italic', direction: 'close', bbcode: '[/i]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('z[/i]', () => {
        expect(MarkdownTokenizer.parse('z[/i]')).to.eql([
          ...text('z[/i]')
        ]);
      });

      // it('*zxc*', () => {
      //   expect(MarkdownTokenizer.parse('*zxc*')).to.eql([{
      //     type: 'paragraph', direction: 'open'
      //   }, {
      //     type: 'inline',
      //     children: [{
      //       type: 'em', direction: 'open'
      //     }, {
      //       content: 'zxc',
      //       type: 'text'
      //     }, {
      //       type: 'em', direction: 'close'
      //     }]
      //   }, {
      //     type: 'paragraph', direction: 'close'
      //   }]);
      // });
    });

    describe('underline', () => {
      it('[u]zxc[/u]', () => {
        expect(MarkdownTokenizer.parse('[u]zxc[/u]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'underline', direction: 'open', bbcode: '[u]' },
              { type: 'text', content: 'zxc' },
              { type: 'underline', direction: 'close', bbcode: '[/u]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('z[/u]', () => {
        expect(MarkdownTokenizer.parse('z[/u]')).to.eql([
          ...text('z[/u]')
        ]);
      });
    });

    describe('strike', () => {
      it('[s]zxc[/s]', () => {
        expect(MarkdownTokenizer.parse('[s]zxc[/s]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'strike', direction: 'open', bbcode: '[s]' },
              { type: 'text', content: 'zxc' },
              { type: 'strike', direction: 'close', bbcode: '[/s]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('z[/s]', () => {
        expect(MarkdownTokenizer.parse('z[/s]')).to.eql([
          ...text('z[/s]')
        ]);
      });
    });

    describe('inline_code', () => {
      it('`zxc`', () => {
        expect(MarkdownTokenizer.parse('`zxc`')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'code_inline', content: 'zxc' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('qwe [code]zxc[/code]', () => {
        expect(MarkdownTokenizer.parse('qwe [code]zxc[/code]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'text', content: 'qwe ' },
              { type: 'code_inline', content: 'zxc' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('``zxc```', () => {
        expect(MarkdownTokenizer.parse('``zxc```')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'code_inline', content: 'zxc' },
              { type: 'text', content: '`' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('a`zxc`A', () => {
        expect(MarkdownTokenizer.parse('a`zxc`A')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'text', content: 'a' },
              { type: 'code_inline', content: 'zxc' },
              { type: 'text', content: 'A' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('z`zxc', () => {
        expect(MarkdownTokenizer.parse('z`zxc')).to.eql([
          ...text('z`zxc')
        ]);
      });
    });


    describe('spoiler_inline', () => {
      it('||zxc||', () => {
        expect(MarkdownTokenizer.parse('||zxc||')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'spoiler_inline', direction: 'open', bbcode: '||' },
              { type: 'text', content: 'zxc' },
              { type: 'spoiler_inline', direction: 'close', bbcode: '||' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
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

    describe('color', () => {
      it('[color=red]zxc[/color]', () => {
        expect(MarkdownTokenizer.parse('[color=red]zxc[/color]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'color', direction: 'open', attrs: [['color', 'red']], bbcode: '[color=red]' },
              { type: 'text', content: 'zxc' },
              { type: 'color', direction: 'close', bbcode: '[/color]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('[color=red]z', () => {
        expect(MarkdownTokenizer.parse('[color=red]z')).to.eql([
          ...text('[color=red]z')
        ]);
      });

      it('z[/color]', () => {
        expect(MarkdownTokenizer.parse('z[/color]')).to.eql([
          ...text('z[/color]')
        ]);
      });
    });

    describe('size', () => {
      it('[size=20]zxc[/size]', () => {
        expect(MarkdownTokenizer.parse('[size=20]zxc[/size]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              { type: 'size', direction: 'open', attrs: [['size', '20']], bbcode: '[size=20]' },
              { type: 'text', content: 'zxc' },
              { type: 'size', direction: 'close', bbcode: '[/size]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('[size=20]z', () => {
        expect(MarkdownTokenizer.parse('[size=20]z')).to.eql([
          ...text('[size=20]z')
        ]);
      });

      it('z[/size]', () => {
        expect(MarkdownTokenizer.parse('z[/size]')).to.eql([
          ...text('z[/size]')
        ]);
      });
    });

    describe('link_inline', () => {
      it('[url=https://ya.ru]zxc[/url]', () => {
        expect(MarkdownTokenizer.parse('[url=https://ya.ru]zxc[/url]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              {
                type: 'link_inline',
                direction: 'open',
                bbcode: '[url=https://ya.ru]',
                attrs: [['href', 'https://ya.ru']]
              },
              { type: 'text', content: 'zxc' },
              { type: 'link_inline', direction: 'close', bbcode: '[/url]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('[url=ya.ru]zxc[/url]', () => {
        expect(MarkdownTokenizer.parse('[url=ya.ru]zxc[/url]')).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              {
                type: 'link_inline',
                direction: 'open',
                bbcode: '[url=ya.ru]',
                attrs: [['href', '//ya.ru']]
              },
              { type: 'text', content: 'zxc' },
              { type: 'link_inline', direction: 'close', bbcode: '[/url]' }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('[url=a]z', () => {
        expect(MarkdownTokenizer.parse('[url=a]z')).to.eql([
          ...text('[url=a]z')
        ]);
      });

      it('z[/url]', () => {
        expect(MarkdownTokenizer.parse('z[/url]')).to.eql([
          ...text('z[/url]')
        ]);
      });
    });
  });

  describe('nodes', () => {
    describe('heading', () => {
      describe('level 1', () => {
        it('# a', () => {
          expect(MarkdownTokenizer.parse('# a')).to.eql([
            { type: 'heading', direction: 'open', attrs: [['level', 1]] },
            { type: 'inline', children: [ { type: 'text', content: 'a' } ] },
            { type: 'heading', direction: 'close' }
          ]);
        });
      });
    });

    describe('blockquote', () => {
      it('> a', () => {
        expect(MarkdownTokenizer.parse('> a')).to.eql([
          { type: 'blockquote', direction: 'open' },
          ...text('a'),
          { type: 'blockquote', direction: 'close' }
        ]);
      });

      it('> a\\n> b\\n> c', () => {
        expect(MarkdownTokenizer.parse('> a\n> b\n> c')).to.eql([
          { type: 'blockquote', direction: 'open' },
          ...text('a'),
          ...text('b'),
          ...text('c'),
          { type: 'blockquote', direction: 'close' }
        ]);
      });

      it('> > a', () => {
        expect(MarkdownTokenizer.parse('> > a')).to.eql([
          { type: 'blockquote', direction: 'open' },
          { type: 'blockquote', direction: 'open' },
          ...text('a'),
          { type: 'blockquote', direction: 'close' },
          { type: 'blockquote', direction: 'close' }
        ]);
      });

      it('> > a\\n> b', () => {
        expect(MarkdownTokenizer.parse('> > a\n> b')).to.eql([
          { type: 'blockquote', direction: 'open' },
          { type: 'blockquote', direction: 'open' },
          ...text('a'),
          { type: 'blockquote', direction: 'close' },
          ...text('b'),
          { type: 'blockquote', direction: 'close' }
        ]);
      });

      it('> a\\n> > b\\n> > c', () => {
        expect(MarkdownTokenizer.parse('> a\n> > b\n> > c')).to.eql([
          { type: 'blockquote', direction: 'open' },
          ...text('a'),
          { type: 'blockquote', direction: 'open' },
          ...text('b'),
          ...text('c'),
          { type: 'blockquote', direction: 'close' },
          { type: 'blockquote', direction: 'close' }
        ]);
      });

      it('> [quote]\\n> a\\n> [/quote]', () => {
        expect(MarkdownTokenizer.parse('> [quote]\n> a\n> [/quote]')).to.eql([
          { type: 'blockquote', direction: 'open' },
          { type: 'quote', direction: 'open' },
          ...text('a'),
          { type: 'quote', direction: 'close' },
          { type: 'blockquote', direction: 'close' }
        ]);
      });
    });

    describe('bullet_list', () => {
      it('- a', () => {
        expect(MarkdownTokenizer.parse('- a')).to.eql([
          { type: 'bullet_list', direction: 'open' },
          { type: 'list_item', direction: 'open' },
          ...text('a'),
          { type: 'list_item', direction: 'close' },
          { type: 'bullet_list', direction: 'close' }
        ]);
      });

      it('- a\\n- b', () => {
        expect(MarkdownTokenizer.parse('- a\n- b')).to.eql([
          { type: 'bullet_list', direction: 'open' },
          { type: 'list_item', direction: 'open' },
          ...text('a'),
          { type: 'list_item', direction: 'close' },
          { type: 'list_item', direction: 'open' },
          ...text('b'),
          { type: 'list_item', direction: 'close' },
          { type: 'bullet_list', direction: 'close' }
        ]);
      });

      it('- test\\nn  zxc', () => {
        expect(MarkdownTokenizer.parse('- test\n  zxc')).to.eql([
          { type: 'bullet_list', direction: 'open' },
          { type: 'list_item', direction: 'open' },
          ...text('test'),
          ...text('zxc'),
          { type: 'list_item', direction: 'close' },
          { type: 'bullet_list', direction: 'close' }
        ]);
      });

      it('- > test', () => {
        expect(MarkdownTokenizer.parse('- > test')).to.eql([
          { type: 'bullet_list', direction: 'open' },
          { type: 'list_item', direction: 'open' },
          { type: 'blockquote', direction: 'open' },
          ...text('test'),
          { type: 'blockquote', direction: 'close' },
          { type: 'list_item', direction: 'close' },
          { type: 'bullet_list', direction: 'close' }
        ]);
      });

      it('[*] a', () => {
        expect(MarkdownTokenizer.parse('[*] a')).to.eql([
          { type: 'bullet_list', direction: 'open' },
          { type: 'list_item', direction: 'open' },
          ...text('a'),
          { type: 'list_item', direction: 'close' },
          { type: 'bullet_list', direction: 'close' }
        ]);
      });

      it('[*]a', () => {
        expect(MarkdownTokenizer.parse('[*]a')).to.eql([
          { type: 'bullet_list', direction: 'open' },
          { type: 'list_item', direction: 'open' },
          ...text('a'),
          { type: 'list_item', direction: 'close' },
          { type: 'bullet_list', direction: 'close' }
        ]);
      });
    });

    describe('code_block', () => {
      it('```\\nzxc\\n```', () => {
        expect(MarkdownTokenizer.parse('```\nzxc\n```')).to.eql([
          { type: 'code_block', content: 'zxc' }
        ]);
      });

      it('```\\nzxc\\nvbn\\n```', () => {
        expect(MarkdownTokenizer.parse('```\nzxc\nvbn\n```')).to.eql([
          { type: 'code_block', content: 'zxc\nvbn' }
        ]);
      });

      it('qwe\\n```\\nzxc\\nvbn\\n```\\nrty', () => {
        expect(MarkdownTokenizer.parse('qwe\n```\nzxc\nvbn\n```\nrty')).to.eql([
          ...text('qwe'),
          { type: 'code_block', content: 'zxc\nvbn' },
          ...text('rty')
        ]);
      });

      it('```\\nzxc', () => {
        expect(MarkdownTokenizer.parse('```\nzxc')).to.eql([
          ...text('```'),
          ...text('zxc')
        ]);
      });

      it('```css\\nzxc', () => {
        expect(MarkdownTokenizer.parse('```css\nzxc')).to.eql([
          ...text('```css'),
          ...text('zxc')
        ]);
      });

      it('```ruby\\nzxc\\n```', () => {
        expect(MarkdownTokenizer.parse('```ruby\nzxc\n```')).to.eql([
          { type: 'code_block', content: 'zxc', attrs: [['language', 'ruby']] }
        ]);
      });

      it('[code]\\nzxc\\n[/code]', () => {
        expect(MarkdownTokenizer.parse('[code]\nzxc\n[/code]')).to.eql([
          { type: 'code_block', content: 'zxc' }
        ]);
      });

      it('q[code=css]w[/code]e', () => {
        expect(MarkdownTokenizer.parse('q[code=css]w[/code]e')).to.eql([
          ...text('q'),
          { type: 'code_block', content: 'w', attrs: [['language', 'css']] },
          ...text('e')
        ]);
      });
    });

    describe('image', () => {
      it('[img]https://test.com[/img]', () => {
        expect(MarkdownTokenizer.parse(
          '[img]https://test.com[/img]'
        )).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              {
                type: 'image',
                attrs: [['src', 'https://test.com'], ['isPoster', false]]
              }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('[poster]https://test.com[/poster]', () => {
        expect(MarkdownTokenizer.parse(
          '[poster]https://test.com[/poster]'
        )).to.eql([
          { type: 'paragraph', direction: 'open' },
          {
            type: 'inline',
            children: [
              {
                type: 'image',
                attrs: [['src', 'https://test.com'], ['isPoster', true]]
              }
            ]
          },
          { type: 'paragraph', direction: 'close' }
        ]);
      });

      it('[img]zxc', () => {
        expect(MarkdownTokenizer.parse('[img]zxc')).to.eql([
          ...text('[img]zxc')
        ]);
      });

      it('[poster]zxc', () => {
        expect(MarkdownTokenizer.parse('[poster]zxc')).to.eql([
          ...text('[poster]zxc')
        ]);
      });
    });

    describe('spoiler', () => {
      it('[spoiler]z[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler]z[/spoiler]')).to.eql([
          { type: 'spoiler_block', direction: 'open' },
          ...text('z'),
          { type: 'spoiler_block', direction: 'close' }
        ]);
      });

      it('[spoiler=qw er]z[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler=qw er]z[/spoiler]')).to.eql([
          { type: 'spoiler_block', direction: 'open', attrs: [['label', 'qw er']] },
          ...text('z'),
          { type: 'spoiler_block', direction: 'close' }
        ]);
      });

      // it('[spoiler=q[b]w[i]e[/i]r[/b]t]z[/spoiler]', () => {
      //   expect(MarkdownTokenizer.parse('[spoiler=q[b]w[i]e[/i]r[/b]t]z[/spoiler]')).to.eql([{
      //     type: 'spoiler_block', direction: 'open',
      //     attrs: [['label', 'q[b]w[i]e[/i]r[/b]t']]
      //   },
      //   ...text('z'),
      //   {
      //     type: 'spoiler_block', direction: 'close'
      //   }]);
      // });

      it('[spoiler=qw er]z[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler=qw er]z[/spoiler]')).to.eql([
          { type: 'spoiler_block', direction: 'open', attrs: [['label', 'qw er']] },
          ...text('z'),
          { type: 'spoiler_block', direction: 'close' }
        ]);
      });

      it('[spoiler]\\nz\\n[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler]\nz\n[/spoiler]')).to.eql([
          { type: 'spoiler_block', direction: 'open' },
          ...text('z'),
          { type: 'spoiler_block', direction: 'close' }
        ]);
      });

      it('[spoiler]\\nz[/spoiler]', () => {
        expect(MarkdownTokenizer.parse('[spoiler]\nz[/spoiler]')).to.eql([
          { type: 'spoiler_block', direction: 'open' },
          ...text('z'),
          { type: 'spoiler_block', direction: 'close' }
        ]);
      });

      it('[spoiler]\\nz[/spoiler]qwe', () => {
        expect(MarkdownTokenizer.parse('[spoiler]\nz[/spoiler]qwe')).to.eql([
          { type: 'spoiler_block', direction: 'open' },
          ...text('z'),
          { type: 'spoiler_block', direction: 'close' },
          ...text('qwe')
        ]);
      });
    });

    describe('quote', () => {
      it('[quote]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote]z[/quote]')).to.eql([
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' }
        ]);
      });

      it('[quote]\\nz\\n[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote]\nz\n[/quote]')).to.eql([
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' }
        ]);
      });

      it('q[quote]z[/quote]x', () => {
        expect(MarkdownTokenizer.parse('q[quote]z[/quote]x')).to.eql([
          ...text('q'),
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' },
          ...text('x')
        ]);
      });

      it('[quote]z[/quote]q', () => {
        expect(MarkdownTokenizer.parse('[quote]z[/quote]q')).to.eql([
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' },
          ...text('q')
        ]);
      });

      it('[quote=x]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote=x]z[/quote]')).to.eql([{
          type: 'quote', direction: 'open',
          attrs: [['nickname', 'x']]
        },
        ...text('z'),
        {
          type: 'quote', direction: 'close'
        }]);
      });

      it('[quote=t1;2;x]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote=t1;2;x]z[/quote]')).to.eql([{
          type: 'quote', direction: 'open',
          attrs: [['topic_id', 1], ['user_id', 2], ['nickname', 'x']]
        },
        ...text('z'),
        {
          type: 'quote', direction: 'close'
        }]);
      });

      it('[quote=m1;2;x]z[/quote]', () => {
        expect(MarkdownTokenizer.parse('[quote=m1;2;x]z[/quote]')).to.eql([{
          type: 'quote', direction: 'open',
          attrs: [['message_id', 1], ['user_id', 2], ['nickname', 'x']]
        },
        ...text('z'),
        {
          type: 'quote', direction: 'close'
        }]);
      });
    });

    describe('center', () => {
      it('[center]z[/center]', () => {
        expect(MarkdownTokenizer.parse('[center]z[/center]')).to.eql([
          { type: 'center', direction: 'open' },
          ...text('z'),
          { type: 'center', direction: 'close' }
        ]);
      });

      it('z[center]x[/center]c', () => {
        expect(MarkdownTokenizer.parse('z[center]x[/center]c')).to.eql([
          ...text('z'),
          { type: 'center', direction: 'open' },
          ...text('x'),
          { type: 'center', direction: 'close' },
          ...text('c')
        ]);
      });
    });

    describe('right', () => {
      it('[right]z[/right]', () => {
        expect(MarkdownTokenizer.parse('[right]z[/right]')).to.eql([
          { type: 'right', direction: 'open' },
          ...text('z'),
          { type: 'right', direction: 'close' }
        ]);
      });

      it('z[right]x[/right]c', () => {
        expect(MarkdownTokenizer.parse('z[right]x[/right]c')).to.eql([
          ...text('z'),
          { type: 'right', direction: 'open' },
          ...text('x'),
          { type: 'right', direction: 'close' },
          ...text('c')
        ]);
      });
    });

    describe('list', () => {
      it('[list]z[/list]', () => {
        expect(MarkdownTokenizer.parse('[list]z[/list]')).to.eql([
          { type: 'div', direction: 'open', attrs: [['data', [['data-list', 'remove-it']]]] },
          ...text('z'),
          { type: 'div', direction: 'close' }
        ]);
      });
    });

    describe('div', () => {
      it('[div]z[/div]', () => {
        expect(MarkdownTokenizer.parse('[div]z[/div]')).to.eql([
          { type: 'div', direction: 'open' },
          ...text('z'),
          { type: 'div', direction: 'close' }
        ]);
      });

      it('  [div]z[/div]', () => {
        expect(MarkdownTokenizer.parse('  [div]z[/div]')).to.eql([
          { type: 'div', direction: 'open' },
          ...text('z'),
          { type: 'div', direction: 'close' }
        ]);
      });

      it('[div][div]z[/div][/div]', () => {
        expect(MarkdownTokenizer.parse('[div][div]z[/div][/div]')).to.eql([
          { type: 'div', direction: 'open' },
          { type: 'div', direction: 'open' },
          ...text('z'),
          { type: 'div', direction: 'close' },
          { type: 'div', direction: 'close' }
        ]);
      });

      it('[div]  [div]z[/div][/div]', () => {
        expect(MarkdownTokenizer.parse('[div]  [div]z[/div][/div]')).to.eql([
          { type: 'div', direction: 'open' },
          { type: 'div', direction: 'open' },
          ...text('z'),
          { type: 'div', direction: 'close' },
          { type: 'div', direction: 'close' }
        ]);
      });

      it('[div][div]z[/div][/div]', () => {
        expect(MarkdownTokenizer.parse('[div][div]z[/div][/div]')).to.eql([
          { type: 'div', direction: 'open' },
          { type: 'div', direction: 'open' },
          ...text('z'),
          { type: 'div', direction: 'close' },
          { type: 'div', direction: 'close' }
        ]);
      });

      it('[div data-test=qwe]z[/div]', () => {
        expect(MarkdownTokenizer.parse(
          '[div data-test=qwe]z[/div]'
        )).to.eql([
          { type: 'div', direction: 'open', attrs: [['data', [['data-test', 'qwe']]]] },
          ...text('z'),
          { type: 'div', direction: 'close' }
        ]);
      });

      it('[div data-test data-fofo]z[/div]', () => {
        expect(MarkdownTokenizer.parse(
          '[div data-test data-fofo]z[/div]'
        )).to.eql([
          {
            type: 'div', direction: 'open',
            attrs: [['data', [['data-test', ''], ['data-fofo', '']]]]
          },
          ...text('z'),
          {
            type: 'div', direction: 'close'
          }
        ]);
      });

      it('[div=aaa bb-cd_e data-test data-fofo]z[/div]', () => {
        expect(MarkdownTokenizer.parse(
          '[div=aaa bb-cd_e data-test data-fofo]z[/div]'
        )).to.eql([
          {
            type: 'div', direction: 'open',
            attrs: [
              ['class', 'aaa bb-cd_e'],
              ['data', [['data-test', ''], ['data-fofo', '']]]
            ]
          },
          ...text('z'),
          {
            type: 'div', direction: 'close'
          }
        ]);
      });

      it('[div]q[div]z[/div][/div]', () => {
        expect(MarkdownTokenizer.parse('[div]q[div]z[/div][/div]')).to.eql([
          { type: 'div', direction: 'open' },
          ...text('q[div]z[/div]'),
          { type: 'div', direction: 'close' }
        ]);
      });

      it('z[div]x[/div]c', () => {
        expect(MarkdownTokenizer.parse('z[div]x[/div]c')).to.eql([
          ...text('z[div]x[/div]c')
        ]);
      });

      it('z[div][/div]c', () => {
        expect(MarkdownTokenizer.parse('z[div][/div]c')).to.eql([
          ...text('z[div][/div]c')
        ]);
      });

      it('a[div]\\n[/div]', () => {
        expect(MarkdownTokenizer.parse('a[div]\n[/div]')).to.eql([
          ...text('a[div]'),
          ...text('[/div]')
        ]);
      });

      it('a[div]\\nc[/div]', () => {
        expect(MarkdownTokenizer.parse('a[div]\nc[/div]')).to.eql([
          ...text('a[div]'),
          ...text('c[/div]')
        ]);
      });

      it('a[div]z\\nx\\nc[/div]', () => {
        expect(MarkdownTokenizer.parse('a[div]z\nx\nc[/div]')).to.eql([
          ...text('a[div]z'),
          ...text('x'),
          ...text('c[/div]')
        ]);
      });

      it('a[div]z\\nx\\nc[/div]v', () => {
        expect(MarkdownTokenizer.parse('a[div]z\nx\nc[/div]v')).to.eql([
          ...text('a[div]z'),
          ...text('x'),
          ...text('c[/div]v')
        ]);
      });

      it('[div]z', () => {
        expect(MarkdownTokenizer.parse('[div]z')).to.eql([
          ...text('[div]z')
        ]);
      });

      it(' [div]z', () => {
        expect(MarkdownTokenizer.parse(' [div]z')).to.eql([
          ...text(' [div]z')
        ]);
      });
    });

    describe('hr', () => {
      it('z\\n[hr]\\nx', () => {
        expect(MarkdownTokenizer.parse('z\n[hr]\nx')).to.eql([
          ...text('z'),
          { type: 'hr' },
          ...text('x')
        ]);
      });

      it('z[hr]x', () => {
        expect(MarkdownTokenizer.parse('z[hr]x')).to.eql([
          ...text('z'),
          { type: 'hr' },
          ...text('x')
        ]);
      });
    });

    describe('link_block', () => {
      it('[url=//ya.ru][quote]z[/quote][/url]', () => {
        expect(MarkdownTokenizer.parse(
          '[url=//ya.ru][quote]z[/quote][/url]'
        )).to.eql([
          { type: 'link_block', direction: 'open', attrs: [['href', '//ya.ru']] },
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' },
          { type: 'link_block', direction: 'close' }
        ]);
      });

      it('[url=//ya.ru]\\n[quote]\\nz\\n[/quote]\\n[/url]', () => {
        expect(MarkdownTokenizer.parse(
          '[url=//ya.ru]\n[quote]\nz\n[/quote]\n[/url]'
        )).to.eql([
          { type: 'link_block', direction: 'open', attrs: [['href', '//ya.ru']] },
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' },
          { type: 'link_block', direction: 'close' }]);
      });

      it('[url=//ya.ru]\\nz\\n[/url]', () => {
        expect(MarkdownTokenizer.parse(
          '[url=//ya.ru]\nz\n[/url]'
        )).to.eql([
          { type: 'link_block', direction: 'open', attrs: [['href', '//ya.ru']] },
          ...text('z'),
          { type: 'link_block', direction: 'close' }]);
      });
    });

    describe('size_block', () => {
      it('[size=24][quote]z[/quote][/size]', () => {
        expect(MarkdownTokenizer.parse(
          '[size=24][quote]z[/quote][/size]'
        )).to.eql([
          { type: 'size_block', direction: 'open', attrs: [['size', '24']] },
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' },
          { type: 'size_block', direction: 'close' }
        ]);
      });

      it('[size=24]\\n[quote]\\nz\\n[/quote]\\n[/size]', () => {
        expect(MarkdownTokenizer.parse(
          '[size=24]\n[quote]\nz\n[/quote]\n[/size]'
        )).to.eql([
          { type: 'size_block', direction: 'open', attrs: [['size', '24']] },
          { type: 'quote', direction: 'open' },
          ...text('z'),
          { type: 'quote', direction: 'close' },
          { type: 'size_block', direction: 'close' }]);
      });
    });
  });

  describe('complex cases', () => {
    it('outside broken formatting', () => {
      expect(MarkdownTokenizer.parse(
        '[b][center]z[/center][/b]'
      )).to.eql([
        ...text('[b]'),
        { type: 'center', direction: 'open' },
        ...text('z'),
        { type: 'center', direction: 'close' },
        ...text('[/b]')
      ]);
    });

    it('treat new line after [hr]', () => {
      expect(MarkdownTokenizer.parse(
        '[hr]\n[spoiler]z[/spoiler]'
      )).to.eql([
        { type: 'hr' },
        { type: 'spoiler_block', direction: 'open' },
        ...text('z'),
        { type: 'spoiler_block', direction: 'close' }
      ]);
    });
  });
});
