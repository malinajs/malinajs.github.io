
import markdown2
import re


def mark(raw):
    parts = re.split(r'\n---\s*\n', raw)
    for i, part in enumerate(parts[1:]):
        r = []
        step = 0
        for s in part.splitlines():
            if s.startswith('```'):
                if step == 0:
                    r.append('\n\n^^^^1\n\n')
                    step = 1
                elif step == 1:
                    r.append(s)
                    r.append('\n\n^^^^2\n\n')
                    step = 2
                    continue
            r.append(s)
        parts[i+1] = '\n\n^^^^0\n\n' + '\n'.join(r)
    raw = ''.join(parts)

    md = MyMarkdown(html4tags=False, tab_width=markdown2.DEFAULT_TAB_WIDTH,
        safe_mode=None, extras={'fenced-code-blocks': {'cssclass': 'highlight'}, 'header-ids': None}, link_patterns=None,
        footnote_title=None, footnote_return_symbol=None,
        use_file_vars=False, cli=False)
    html = md.convert(raw)

    html = html.replace('^^^^0', '<div class="columns2"><div>')
    html = html.replace('^^^^1', '</div>')
    html = html.replace('^^^^2', '</div>')

    return md._menu, html


class MyMarkdown(markdown2.Markdown):
    def __init__(self, *a, **kw):
        self._menu = []
        super().__init__(*a, **kw)

    def reset(self):
        super().reset()
        self.html_blocks['^^^^0'] = '^^^^0'
        self.html_blocks['^^^^1'] = '^^^^1'
        self.html_blocks['^^^^2'] = '^^^^2'
    
    def header_id_from_text(self, text, prefix, n):
        r = super().header_id_from_text(text, prefix, n)
        self._menu.append((r, text, n))
        return r
