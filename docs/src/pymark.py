
import markdown2
import re


def mark(raw):
    raw = re.sub(r'(\^\^\^\^\w*)', r'\n\n\1\n\n', raw)
    md = MyMarkdown(html4tags=False, tab_width=markdown2.DEFAULT_TAB_WIDTH,
        safe_mode=None, extras={'fenced-code-blocks': {'cssclass': 'highlight'}, 'header-ids': None}, link_patterns=None,
        footnote_title=None, footnote_return_symbol=None,
        use_file_vars=False, cli=False)
    html = md.convert(raw)

    parts = html.split('^^^^block')
    for i, part in enumerate(parts):

        if '^^^^' not in part:
            continue

        rx = re.search(r'<div\s+class="highlight', part)
        if not rx:
            continue

        if part.count('^^^^') != 1:
            print(part[:300])
            raise Exception('Block is not closed')

        s = rx.start()
        part = '<div class="columns2"><div>' + part[:s] + '</div>' + part[s:]
        parts[i] = part.replace('^^^^', '</div>')

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
