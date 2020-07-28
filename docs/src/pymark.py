
import markdown2
import re


def mark(raw):
    raw = raw.replace('^^^^', '\n\n^^^^\n\n')
    md = MyMarkdown(html4tags=False, tab_width=markdown2.DEFAULT_TAB_WIDTH,
        safe_mode=None, extras={'fenced-code-blocks': {'cssclass': 'highlight'}, 'header-ids': None}, link_patterns=None,
        footnote_title=None, footnote_return_symbol=None,
        use_file_vars=False, cli=False)
    html = md.convert(raw)

    parts = html.split('^^^^')
    for i, part in enumerate(parts):

        rx = re.search(r'<div\s+class="highlight', part)
        if not rx:
            continue

        s = rx.start()
        parts[i] = '<div class="columns2"><div>' + part[:s] + '</div>' + part[s:] + '</div>'

    return md._menu, ''.join(parts)


class MyMarkdown(markdown2.Markdown):
    def __init__(self, *a, **kw):
        self._menu = []
        super().__init__(*a, **kw)

    def reset(self):
        super().reset()
        self.html_blocks['^^^^'] = '^^^^'
    
    def header_id_from_text(self, text, prefix, n):
        r = super().header_id_from_text(text, prefix, n)
        self._menu.append((r, text, n))
        return r
